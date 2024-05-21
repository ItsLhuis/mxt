const axios = require("axios")

class ReleansClient {
  constructor(apiKey) {
    Object.defineProperty(this, "apiKey", {
      value: apiKey,
      writable: false,
      configurable: false,
      enumerable: true
    })
    Object.defineProperty(this, "baseUrl", {
      value: "https://api.releans.com/v2",
      writable: false,
      configurable: false,
      enumerable: true
    })
    Object.defineProperty(this, "client", {
      value: axios.create({
        baseURL: this.baseUrl,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      }),
      writable: false,
      configurable: false,
      enumerable: true
    })

    Object.freeze(this)
  }

  send(sender, mobile, content) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.client.post("/message", {
          sender,
          mobile,
          content
        })
        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    })
  }

  get(messageId) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.client.get(`/message?id=${messageId}`)
        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    })
  }
}

module.exports = ReleansClient
