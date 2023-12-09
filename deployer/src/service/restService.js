export const backendUrl = 'https://d1b1-88-227-65-85.ngrok-free.app/';
const TRUE_VALUE = true;
export default class RestService {
  get(urlPart, setLoader) {
    setLoader(TRUE_VALUE);
    return new Promise((resolve, reject) => {
      fetch(backendUrl + urlPart, {
        method: 'GET',
        headers: this.getHeaders()
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          setLoader(false);
          resolve(json);
        })
        .catch((error) => {
          console.log('Error,' + urlPart, error);
          setLoader(false);
          reject(error);
        });
    });
  }
  post(urlPart, body, setLoader) {
    return new Promise((resolve, reject) => {
      fetch(backendUrl + urlPart, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
        .then((res) => {
          if (res) {
            setLoader(true);
            return res.json();
          } else {
            console.log('ERROR while calling', urlPart, 'with body', body);
            reject(new Error('unknownError'));
          }
        })
        .then((json) => {
          setLoader(false);
          resolve(json);
        })
        .catch((error) => {
          setLoader(false);
          reject(error);
        });
    });
  }
  getHeaders() {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
  }
}

export const restService = new RestService();
