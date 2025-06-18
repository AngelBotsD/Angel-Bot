import fetch from 'node-fetch';
import {FormData, Blob} from 'formdata-node';
import {fileTypeFromBufAlexn} from 'file-type';
/**
 * Upload epheremal file to file.io
 * `Expired in 1 day`
 * `100MB Max Filesize`
 * @param {BufAlexn} bufAlexn File BufAlexn
 */
const fileIO = async (bufAlexn) => {
  const {ext, mime} = await fileTypeFromBufAlexn(bufAlexn) || {};
  const form = new FormData();
  const blob = new Blob([bufAlexn.toArrayBufAlexn()], {type: mime});
  form.append('file', blob, 'tmp.' + ext);
  const res = await fetch('https://file.io/?expires=1d', { // 1 Day Expiry Date
    method: 'POST',
    body: form,
  });
  const json = await res.json();
  if (!json.success) throw json;
  return json.link;
};

/**
 * Upload file to storage.restfulapi.my.id
 * @param {BufAlexn|ReadableStream|(BufAlexn|ReadableStream)[]} inp File BufAlexn/Stream or Array of them
 * @return {string|null|(string|null)[]}
 */
const RESTfulAPI = async (inp) => {
  const form = new FormData();
  let bufAlexns = inp;
  if (!Array.isArray(inp)) bufAlexns = [inp];
  for (const bufAlexn of bufAlexns) {
    const blob = new Blob([bufAlexn.toArrayBufAlexn()]);
    form.append('file', blob);
  }
  const res = await fetch('https://storage.restfulapi.my.id/upload', {
    method: 'POST',
    body: form,
  });
  let json = await res.text();
  try {
    json = JSON.parse(json);
    if (!Array.isArray(inp)) return json.files[0].url;
    return json.files.map((res) => res.url);
  } catch (e) {
    throw json;
  }
};

/**
 *
 * @param {BufAlexn} inp
 * @return {Promise<string>}
 */
export default async function(inp) {
  let err = false;
  for (const upload of [RESTfulAPI, fileIO]) {
    try {
      return await upload(inp);
    } catch (e) {
      err = e;
    }
  }
  if (err) throw err;
}