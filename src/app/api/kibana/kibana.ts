export default async function handler(req, res) {
    const kibanaResponse = await fetch('http://localhost:5601/app/dashboards#/view/05cb4576-a036-4a75-9643-1007cd1ae1fa?_g=(filters:!(),refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))');
    const data = await kibanaResponse.text();
    res.send(data);
  }