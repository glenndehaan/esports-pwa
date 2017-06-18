export default class api {

    /**
     * Creates an instance
     */
    constructor(url, callback, extraData = false) {
        this.data = false;
        this.url = url;
        this.callback = callback;
        this.extraData = extraData;

        this.getApiData();
    }

    getApiData() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    this.data = JSON.parse(xhr.responseText);
                    this.callback(this.data, this.extraData)
                } else {
                    console.error(xhr);
                }
            }
        };

        xhr.open("GET", this.url, true);
        xhr.send();
    }
}
