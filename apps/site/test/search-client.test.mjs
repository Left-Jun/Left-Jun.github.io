import assert from "node:assert/strict";
import test from "node:test";

class FakeClassList {
  values = new Set();

  add(value) {
    this.values.add(value);
  }

  remove(value) {
    this.values.delete(value);
  }
}

class FakeElement {
  constructor() {
    this.attributes = new Map();
    this.children = [];
    this.classList = new FakeClassList();
    this.dataset = {};
    this.hidden = false;
    this.id = "";
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  append(...children) {
    this.children.push(...children);
  }

  replaceChildren(...children) {
    this.children = [...children];
  }
}

class FakeInput extends FakeElement {
  constructor() {
    super();
    this.listeners = new Map();
    this.value = "";
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  emit(type, event = {}) {
    this.listeners.get(type)?.(event);
  }

  blur() {}
}

test("search results expose their expanded state and controlled live region", async (t) => {
  const input = new FakeInput();
  const results = new FakeElement();
  results.hidden = true;
  const shell = new FakeElement();
  shell.dataset.searchIndexUrl = "/test-search-index.json";
  shell.dataset.searchVariant = "top";
  shell.querySelector = (selector) => selector === "[data-search-input]" ? input : results;
  shell.contains = () => false;

  const listeners = new Map();
  const fakeDocument = {
    documentElement: { dataset: {} },
    querySelectorAll(selector) {
      return selector === "[data-search-shell]" ? [shell] : [];
    },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    createElement() {
      return new FakeElement();
    }
  };

  t.mock.method(globalThis, "fetch", async () => ({
    ok: true,
    async json() {
      return [{
        title: "Gameplay System",
        description: "A test result",
        section: "Project",
        tags: ["Unity"],
        search: "gameplay system unity",
        url: "/projects/gameplay-system/"
      }];
    }
  }));
  globalThis.document = fakeDocument;
  globalThis.HTMLElement = FakeElement;
  globalThis.HTMLInputElement = FakeInput;
  globalThis.Node = FakeElement;

  const { initSiteSearch } = await import("../src/scripts/search-client.js");
  initSiteSearch(fakeDocument);

  assert.match(results.id, /^leftjun-search-results-/);
  assert.equal(input.getAttribute("aria-controls"), results.id);
  assert.equal(input.getAttribute("aria-expanded"), "false");
  assert.equal(results.getAttribute("aria-live"), "polite");
  assert.equal(results.getAttribute("aria-atomic"), "false");

  input.value = "gameplay";
  input.emit("input");
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(results.hidden, false);
  assert.equal(results.children.length, 1);
  assert.equal(input.getAttribute("aria-expanded"), "true");

  input.emit("keydown", { key: "Escape" });
  assert.equal(results.hidden, true);
  assert.equal(results.children.length, 0);
  assert.equal(input.getAttribute("aria-expanded"), "false");
});
