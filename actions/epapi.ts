import * as request from 'superagent';

export async function epApiQuery(event) {
    const baseUrl = 'https://equipmentgram.com/wp-json/gf/v2/forms';
    const { formId, pageSize, currentPage } = event;
    const { EQAPI_GFKEY, EQAPI_GFSEC } = process.env;
    if (!EQAPI_GFKEY || !EQAPI_GFSEC) {
        const error = (`EQAPI_GFKEY and EQAPI_GFSEC must be set`);
        console.log(error);
        return {
            error,
        }
    }
    const sec = 'Basic ' + Buffer.from(`${EQAPI_GFKEY}:${EQAPI_GFSEC}`).toString('base64');
    let url = '';
    if (!formId) {
        url = baseUrl;
    } else if (!currentPage) {
        url = `${baseUrl}/${parseInt(formId)}`;
    } else {
        url = `${baseUrl}/${parseInt(formId)}/entries?sorting[key]=id&sorting[direction]=DESC&sorting[is_numeric]=true&paging[page_size]=${parseInt(pageSize || 20)}&paging[current_page]=${parseInt(currentPage || 1)}`;
    }
    console.log(url);
    return request.get(url).set('Authorization', sec).send().then(r => r.body);
}