import { createId } from "@paralleldrive/cuid2"

/**
 * Plugin configuration.
 */
export default {
    ce_prefix: createId(),
    identifier: 'org.username.plugin-template',
    name: 'Cider Plugin Template',
    description: 'A template for creating a Cider plugin.',
    version: '0.0.1',
    author: 'your_username',
    repo: 'https://github.com/ciderapp/plugin-template',
    entry: {
        'plugin.js': {
            type: 'main',
        }
    }
}