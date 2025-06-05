export async function POST(req) {
  const body = await req.formData();

  const response = await fetch('http://backend.internal:3005', {
    method: 'POST',
    body,
  });

  const contentType = response.headers.get('Content-Type');

  const data = await response.arrayBuffer();
  return new Response(data, {
    status: response.status,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': response.headers.get('Content-Disposition') || '',
    },
  });
}

export async function GET() {
  const response = await fetch('http://backend.internal:3005', {
    method: 'GET',
  });

  const json = await response.json();
  return new Response(JSON.stringify(json), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
