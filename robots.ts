import { site } from "@/config/site";
export default () => ({ rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }, sitemap: `${site.url}/sitemap.xml` });
