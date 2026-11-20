// Send www.studybuddyj.net to studybuddyj.net (same page), so there is one address.
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === 'www.studybuddyj.net') {
    url.hostname = 'studybuddyj.net';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
