const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Supabase URL or key not configured' }),
    };
  }

  const { path, httpMethod, headers, body } = event;

  // Construir la URL de Supabase a la que se hará proxy.
  // path contendrá algo como '/.netlify/functions/proxy/users'
  // por lo que necesitamos quitar el prefijo.
  const supabasePath = path.replace('/.netlify/functions/proxy', '');
  const url = `${supabaseUrl}${supabasePath}`;

  try {
    const response = await fetch(url, {
      method: httpMethod,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        // Otros headers que puedan ser necesarios
      },
      body: body,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch from Supabase' }),
    };
  }
};