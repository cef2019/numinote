import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, imageUrl, url }) => {
  const appName = 'Numinote - Nonprofit Management';
  const defaultDescription = "Streamline your nonprofit's finances, projects, and operations with Numinote. The intuitive, powerful, and affordable solution for organizations making a difference.";
  
  const metaTitle = title ? `${title} | ${appName}` : appName;
  const metaDescription = description || defaultDescription;
  const canonicalUrl = url ? `${window.location.origin}${url}` : window.location.origin;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta property="og:site_name" content="Numinote" />

      <meta name="twitter:card" content={imageUrl ? "summary_large_image" : "summary"} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  );
};

export default SEO;