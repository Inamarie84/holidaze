// app/venues/[id]/edit/head.tsx
export default function Head() {
  // Keep this static so Next can render <title> in the initial HTML <head>
  return (
    <>
      <title>Edit venue • Holidaze</title>
      <meta name="description" content="Update your venue details" />
      {/* Do NOT include <link rel="icon"> here; root layout already provides it */}
    </>
  )
}
