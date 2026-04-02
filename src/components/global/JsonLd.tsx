interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data)
    ? {
        "@context": "https://schema.org",
        "@graph": data.map((item) => {
          const normalizedItem = { ...item };
          delete normalizedItem["@context"];
          return normalizedItem;
        }),
      }
    : data;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
