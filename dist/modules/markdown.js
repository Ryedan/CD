import replaceAsync from 'string-replace-async';
import { LINK_PREFIX } from '../utils/index.js';
export class Markdown {
    VK;
    constructor(VK) {
        this.VK = VK;
    }
    async fix(text) {
        // Fix ссылок
        text = text.replace(/\[([^[]+?)\|([^]+?)]/g, (match, link, title) => (`[${title}](${!link.startsWith(LINK_PREFIX) ? LINK_PREFIX : ''}${link})`));
        // Fix хештегов
        text = await replaceAsync(text, /(?:^|\s)#([^\s]+)/g, async (match, hashtag) => {
            const space = match.startsWith('\n') ?
                '\n'
                :
                    match.startsWith(' ') ?
                        ' '
                        :
                            '';
            const isNavigationHashtag = match.match(/#([^\s]+)@([a-zA-Z_\d]+)/);
            if (isNavigationHashtag) {
                const [, hashtag, group] = isNavigationHashtag;
                const resource = await this.VK.resolveResource(group)
                    .catch(() => null);
                if (resource?.type === 'group') {
                    if (hashtag.match(/[a-zA-Z]+/)) {
                        return `${space}[#${hashtag}@${group}](${LINK_PREFIX}${group}/${hashtag})`;
                    }
                    return `${space}[#${hashtag}@${group}](${LINK_PREFIX}wall-${resource.id}?q=%23${hashtag})`;
                }
            }
            return `${space}[#${hashtag}](${LINK_PREFIX}feed?section=search&q=%23${hashtag})`;
        });
        try {
            return decodeURI(text);
        }
        catch {
            return text;
        }
    }
}
