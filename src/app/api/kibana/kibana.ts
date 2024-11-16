export default async function handler(req, res) {
    const kibanaResponse = await fetch('http://localhost:5601/app/dashboards');
    const data = await kibanaResponse.text();
    res.send(data);
  }
