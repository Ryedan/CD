export const LINK_PREFIX = 'https://vk.ru/';
export function getPostLink({ owner_id, id }) {
    return `${LINK_PREFIX}wall${owner_id}_${id}`;
}
