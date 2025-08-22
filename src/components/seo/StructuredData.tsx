import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any>;
  id?: string;
}

export function StructuredData({ data, id }: StructuredDataProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  );
}