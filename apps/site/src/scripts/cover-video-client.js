const COVER_VIDEO_SELECTOR = "video[data-cover-video]";
const COVER_VIDEO_SYNC_EVENT = "leftjun:cover-video-sync";
const VISIBILITY_THRESHOLD = 0.2;
const controllers = new WeakMap();

export function shouldPlayCoverVideo({
  isIntersecting = false,
  isDocumentHidden = false,
  prefersReducedMotion = false,
  isElementVisible = true,
  isHeroActive = true,
  playbackFailed = false
} = {}) {
  return Boolean(
    isIntersecting &&
    !isDocumentHidden &&
    !prefersReducedMotion &&
    isElementVisible &&
    isHeroActive &&
    !playbackFailed
  );
}

function documentFor(root) {
  if (root?.nodeType === 9) return root;
  return root?.ownerDocument || globalThis.document;
}

function videoIsVisible(video, view) {
  if (video.hidden || video.closest?.("[hidden]")) return false;
  if (typeof video.getClientRects === "function" && video.getClientRects().length === 0) return false;
  const style = view?.getComputedStyle?.(video);
  return !style || (style.display !== "none" && style.visibility !== "hidden");
}

function heroIsActive(video) {
  const slide = video.closest?.("[data-hero-slide]");
  return !slide || slide.classList.contains("is-active");
}

export function isCoverVideoCandidate(video) {
  return Boolean(video?.matches?.(COVER_VIDEO_SELECTOR) && !video.closest?.(".article-content"));
}

function resetToPoster(video, state) {
  if (state.posterReset) return;
  video.pause?.();
  try {
    video.currentTime = 0;
  } catch {}
  video.load?.();
  state.posterReset = true;
}

function syncVideo(controller, video) {
  const state = controller.states.get(video);
  if (!state) return;

  const reducedMotion = controller.reduceMotionQuery?.matches === true;
  const shouldPlay = shouldPlayCoverVideo({
    isIntersecting: state.isIntersecting,
    isDocumentHidden: controller.document.hidden,
    prefersReducedMotion: reducedMotion,
    isElementVisible: videoIsVisible(video, controller.view),
    isHeroActive: heroIsActive(video),
    playbackFailed: state.playbackFailed
  });

  if (!shouldPlay) {
    video.pause?.();
    if (reducedMotion || state.playbackFailed) resetToPoster(video, state);
    return;
  }

  if (video.paused === false || state.playPending) return;
  state.posterReset = false;
  state.playPending = true;
  let playResult;
  try {
    playResult = video.play?.();
  } catch (error) {
    state.playPending = false;
    state.playbackFailed = true;
    resetToPoster(video, state);
    return;
  }

  Promise.resolve(playResult).then(() => {
    state.playPending = false;
  }).catch((error) => {
    state.playPending = false;
    if (error?.name === "AbortError") {
      scheduleSync(controller);
      return;
    }
    state.playbackFailed = true;
    resetToPoster(video, state);
  });
}

function collectVideos(root) {
  const videos = [];
  if (isCoverVideoCandidate(root)) videos.push(root);
  root?.querySelectorAll?.(COVER_VIDEO_SELECTOR).forEach((video) => {
    if (isCoverVideoCandidate(video)) videos.push(video);
  });
  return videos;
}

function observeVideos(controller, root) {
  collectVideos(root).forEach((video) => {
    if (controller.states.has(video)) return;
    controller.states.set(video, {
      isIntersecting: !controller.intersectionObserver,
      playPending: false,
      playbackFailed: false,
      posterReset: false
    });
    controller.videos.add(video);
    controller.intersectionObserver?.observe(video);
  });
}

function syncController(controller, root = controller.document) {
  observeVideos(controller, root);
  controller.videos.forEach((video) => {
    if (video.isConnected === false || !isCoverVideoCandidate(video)) {
      video.pause?.();
      controller.intersectionObserver?.unobserve(video);
      controller.videos.delete(video);
      controller.states.delete(video);
      return;
    }
    syncVideo(controller, video);
  });
}

function scheduleSync(controller) {
  if (controller.syncScheduled) return;
  controller.syncScheduled = true;
  const schedule = controller.view?.requestAnimationFrame || ((callback) => setTimeout(callback, 0));
  schedule(() => {
    controller.syncScheduled = false;
    syncController(controller);
  });
}

export function mutationTouchesCoverVideo(record) {
  const nodeContainsCoverVideo = (node) => Boolean(
    node?.matches?.(COVER_VIDEO_SELECTOR) || node?.querySelector?.(COVER_VIDEO_SELECTOR)
  );

  if (record?.type === "attributes") return nodeContainsCoverVideo(record.target);
  return [...(record?.addedNodes || []), ...(record?.removedNodes || [])].some(nodeContainsCoverVideo);
}

function createController(documentRef) {
  const view = documentRef.defaultView || globalThis.window;
  const reduceMotionQuery = view?.matchMedia?.("(prefers-reduced-motion: reduce)");
  const controller = {
    document: documentRef,
    view,
    reduceMotionQuery,
    states: new WeakMap(),
    videos: new Set(),
    intersectionObserver: null,
    mutationObserver: null,
    syncScheduled: false
  };

  if (view?.IntersectionObserver) {
    controller.intersectionObserver = new view.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const state = controller.states.get(entry.target);
        if (!state) return;
        state.isIntersecting = entry.isIntersecting && entry.intersectionRatio >= VISIBILITY_THRESHOLD;
        syncVideo(controller, entry.target);
      });
    }, { threshold: [0, VISIBILITY_THRESHOLD] });
  }

  const onVisibilityChange = () => syncController(controller);
  const onReducedMotionChange = () => syncController(controller);
  const onExplicitSync = () => syncController(controller);
  documentRef.addEventListener("visibilitychange", onVisibilityChange);
  documentRef.addEventListener(COVER_VIDEO_SYNC_EVENT, onExplicitSync);
  reduceMotionQuery?.addEventListener?.("change", onReducedMotionChange);

  if (view?.MutationObserver && documentRef.documentElement) {
    controller.mutationObserver = new view.MutationObserver((records) => {
      let shouldSync = false;
      records.forEach((record) => {
        record.addedNodes?.forEach((node) => observeVideos(controller, node));
        if (mutationTouchesCoverVideo(record)) shouldSync = true;
      });
      if (shouldSync) scheduleSync(controller);
    });
    controller.mutationObserver.observe(documentRef.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "hidden", "style", "aria-hidden"]
    });
  }

  controllers.set(documentRef, controller);
  return controller;
}

export function initCoverVideos(root = globalThis.document) {
  const documentRef = documentFor(root);
  if (!documentRef) return null;
  const controller = controllers.get(documentRef) || createController(documentRef);
  syncController(controller, root);

  if (controller.view) {
    controller.view.LeftJunCoverVideos = {
      init: initCoverVideos,
      sync: syncCoverVideos,
      eventName: COVER_VIDEO_SYNC_EVENT
    };
  }
  return controller;
}

export function syncCoverVideos(root = globalThis.document) {
  const documentRef = documentFor(root);
  if (!documentRef) return;
  const controller = controllers.get(documentRef) || initCoverVideos(root);
  if (controller) syncController(controller, root);
}
