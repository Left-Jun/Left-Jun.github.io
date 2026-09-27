const SCU_LENS_ORIGIN = "https://leftjun-dp2a7jcovian.edgeone.dev";

export function middleware(context) {
  const { request, next, rewrite } = context;
  const url = new URL(request.url);

  if (url.hostname !== "sculens.leftjun.com") {
    return next();
  }

  const target = new URL(url.pathname + url.search, SCU_LENS_ORIGIN);
  return rewrite(target.toString());
}

export const config = {
  matcher: "/:path*",
};
