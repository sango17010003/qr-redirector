const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 10000;

// Paste your actual credentials inside quotes below:
const supabaseUrl = 'https://wqixrjcoeuaafozeukcw.supabase.co/';
const supabaseKey = 'sb_publishable_kwsA6oBUc1u3F7nBldxRdQ_XbrTg4Oa';
const base44Url = 'https://weightless-pulse-rate-go.base44.app';

const supabase = createClient(supabaseUrl, supabaseKey);

// Root route to test if server is alive
app.get('/', (req, res) => {
  res.send('QR Redirector Server is Live and Working!');
});

// Dynamic redirect route
app.get('/r/:stand_slug', async (req, res) => {
  try {
    const { stand_slug } = req.params;

    const { data: stand, error } = await supabase
      .from('qr_stands')
      .select('*')
      .eq('stand_slug', stand_slug)
      .single();

    if (error || !stand) {
      return res.status(404).send(`<h1>Stand Not Found in Supabase</h1><p>${error ? error.message : 'No matching slug found'}</p>`);
    }

    const redirectUrl = new URL(base44Url);
    redirectUrl.searchParams.set('qr_id', stand.stand_slug);
    redirectUrl.searchParams.set('shop_name', stand.shop_name);
    redirectUrl.searchParams.set('owner_whatsapp', stand.owner_whatsapp);
    redirectUrl.searchParams.set('google_review_url', stand.google_review_url);

    return res.redirect(302, redirectUrl.toString());
  } catch (err) {
    console.error('Error redirecting:', err);
    return res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});