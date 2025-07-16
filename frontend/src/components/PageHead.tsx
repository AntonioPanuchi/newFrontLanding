import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageHeadProps {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}

const PageHead: React.FC<PageHeadProps> = ({ 
  title, 
  description, 
  path = '', 
  noIndex = false 
}) => {
  const fullTitle = title.includes('ROX.VPN') ? title : `${title} – ROX.VPN`;
  const fullUrl = `https://rx-test.ru${path}`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="ROX.VPN" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@ROX_VPN" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default PageHead; 

