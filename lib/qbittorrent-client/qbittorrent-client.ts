import { IRequestHelper, RequestOptions } from './interfaces/request-helper.interface';
import { filterEmptyValues } from './utils/object';

export type AddTorrentOptions = {
	urls: string;
	savepath?: string;
	cookie?: string;
	category?: string;
	tags?: string;
	skip_checking?: boolean;
	paused?: boolean;
	root_folder?: string;
	rename?: string;
	upLimit?: number;
	dlLimit?: number;
	ratioLimit?: number;
	seedingTimeLimit?: number;
	autoTMM?: boolean;
	sequentialDownload?: boolean;
	firstLastPiecePrio?: boolean;
};

export type QBittorrentClientConstructorOptions = {
	baseURL: string;
	auth?: {
		username: string;
		password: string;
	};
	requestHelper: IRequestHelper;
};

export class QBittorrentClient {
	private cookie: string | null = null;

	constructor(private readonly options: QBittorrentClientConstructorOptions) {}

	public async fetchCookie() {
		const requestConfig: RequestOptions = {
			method: 'POST',
			headers: {
				Referer: this.options.baseURL,
			},
			baseURL: this.options.baseURL,
			url: '/api/v2/auth/login',
			body: new URLSearchParams({
				username: this.options.auth?.username as string,
				password: this.options.auth?.password as string,
			}),
		};

		const resp = await this.doRequest(requestConfig, false);
		const setCookie = resp.headers['set-cookie'];
		const cookie = Array.isArray(setCookie) ? setCookie.join('; ') : setCookie;

		return cookie;
	}

	private async buildHeaders(additionalHeaders: Record<string, any>) {
		const headers = {
			...additionalHeaders,
		};

		// If we have a valid cookie, add it to the headers
		if (this.cookie && this.cookie !== 'session-active') {
			headers.cookie = this.cookie;
		}

		// If we don't have a cookie and authentication is required
		if (this.options.auth && this.cookie === null) {
			const cookie = await this.fetchCookie();
			headers.cookie = cookie;
		}

		return headers;
	}

	private async doRequest(
		request: Omit<RequestOptions, 'returnFullResponse'>,
		refreshCookieIfForbidden: boolean = true,
	) {
		const requestWithFullResponse = {
			...request,
			returnFullResponse: true,
		};
		const unsafeDoRequest = () => this.options.requestHelper.request(requestWithFullResponse);

		try {
			return await unsafeDoRequest();
		} catch (e: any) {
			// If the response is "Forbidden", it means that the session has expired
			if (
				e === 'Forbidden' ||
				(typeof e === 'object' && e.status === 403 && refreshCookieIfForbidden)
			) {
				this.cookie = await this.fetchCookie();
				return await unsafeDoRequest();
			}
			throw e;
		}
	}

	// ==================== Application API ====================

	public async getAppVersion() {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: '/api/v2/app/version',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async getWebApiVersion() {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: '/api/v2/app/webapiVersion',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async getBuildInfo() {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: '/api/v2/app/buildInfo',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async getPreferences() {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: '/api/v2/app/preferences',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async setPreferences(pref: Record<string, unknown>) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/app/setPreferences',
			headers: await this.buildHeaders({}),
			body: { json: pref },
		};

		return await this.doRequest(requestOptions);
	}

	// ==================== Logs API ====================

	public async getLogs(normal: boolean = true, info: boolean = true) {
		const params = new URLSearchParams({
			normal: normal.toString(),
			info: info.toString(),
		});

		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: `/api/v2/log/main?${params.toString()}`,
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async peekLog(lastLines: number = 1000) {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: `/api/v2/log/peek?lastLines=${lastLines}`,
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	// ==================== Transfer API ====================

	public async getTransferInfo() {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: '/api/v2/transfer/info',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async setGlobalDownloadLimit(limit: number) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/transfer/setDownloadLimit',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ limit: limit.toString() }),
		};

		return await this.doRequest(requestOptions);
	}

	public async setGlobalUploadLimit(limit: number) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/transfer/setUploadLimit',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ limit: limit.toString() }),
		};

		return await this.doRequest(requestOptions);
	}

	public async toggleSpeedLimitsMode() {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/transfer/toggleSpeedLimitMode',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	// ==================== Torrents API ====================

	public async addTorrent(options: AddTorrentOptions) {
		const getBooleanValue = (value?: boolean) => {
			if (value !== undefined) {
				return value ? 'true' : 'false';
			}
			return value;
		};

		const body = {
			urls: options.urls,
			...filterEmptyValues({
				savepath: options.savepath,
				cookie: options.cookie,
				category: options.category,
				tags: options.tags,
				skip_checking: getBooleanValue(options.skip_checking),
				paused: getBooleanValue(options.paused),
				root_folder: options.root_folder,
				rename: options.rename,
				upLimit: options.upLimit?.toString(),
				dlLimit: options.dlLimit?.toString(),
				ratioLimit: options.ratioLimit?.toString(),
				seedingTimeLimit: options.seedingTimeLimit?.toString(),
				autoTMM: getBooleanValue(options.autoTMM),
				sequentialDownload: getBooleanValue(options.sequentialDownload),
				firstLastPiecePrio: getBooleanValue(options.firstLastPiecePrio),
			}),
		};

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/add',
			headers: await this.buildHeaders({
				'content-type': 'multipart/form-data',
			}),
			body,
		};

		return await this.doRequest(requestOptions);
	}

	public async getTorrentsList() {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/info',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async getTorrentProperties(hash: string) {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: `/api/v2/torrents/properties?hash=${hash}`,
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async getTorrentTrackers(hash: string) {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: `/api/v2/torrents/trackers?hash=${hash}`,
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async getTorrentWebSeeds(hash: string) {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: `/api/v2/torrents/webseeds?hash=${hash}`,
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async getTorrentFiles(hash: string) {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: `/api/v2/torrents/files?hash=${hash}`,
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async pauseTorrent(hashes: string | string[]) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/pause',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ hashes: hashList }),
		};

		return await this.doRequest(requestOptions);
	}

	public async resumeTorrent(hashes: string | string[]) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/resume',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ hashes: hashList }),
		};

		return await this.doRequest(requestOptions);
	}

	public async deleteTorrent(hashes: string | string[], deleteFiles: boolean = false) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/delete',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				hashes: hashList,
				deleteFiles: deleteFiles.toString(),
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async recheckTorrent(hashes: string | string[]) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/recheck',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ hashes: hashList }),
		};

		return await this.doRequest(requestOptions);
	}

	public async reannounceTorrent(hashes: string | string[]) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/reannounce',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ hashes: hashList }),
		};

		return await this.doRequest(requestOptions);
	}

	public async setTorrentCategory(hashes: string | string[], category: string) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/setCategory',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				hashes: hashList,
				category,
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async setTorrentLocation(hashes: string | string[], location: string) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/setLocation',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				hashes: hashList,
				location,
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async setTorrentPriority(hashes: string | string[], priority: number) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/setPriority',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				hashes: hashList,
				priority: priority.toString(),
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async setTorrentDownloadLimit(hashes: string | string[], limit: number) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/setDownloadLimit',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				hashes: hashList,
				limit: limit.toString(),
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async setTorrentUploadLimit(hashes: string | string[], limit: number) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/setUploadLimit',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				hashes: hashList,
				limit: limit.toString(),
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async setTorrentFilePriority(hash: string, id: number, priority: number) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/filePrio',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				hash,
				id: id.toString(),
				priority: priority.toString(),
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async addTrackers(hash: string, urls: string) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/addTrackers',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ hash, urls }),
		};

		return await this.doRequest(requestOptions);
	}

	public async editTracker(hash: string, originalUrl: string, newUrl: string) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/editTracker',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				hash,
				originalUrl,
				newUrl,
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async removeTrackers(hash: string, urls: string) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/removeTrackers',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ hash, urls }),
		};

		return await this.doRequest(requestOptions);
	}

	public async addTorrentTags(hashes: string | string[], tags: string) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/addTags',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				hashes: hashList,
				tags,
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async removeTorrentTags(hashes: string | string[], tags: string) {
		const hashList = Array.isArray(hashes) ? hashes.join('|') : hashes;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/removeTags',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				hashes: hashList,
				tags,
			}),
		};

		return await this.doRequest(requestOptions);
	}

	// ==================== Categories API ====================

	public async getCategories() {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/categories',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async createCategory(
		name: string,
		savePath: string,
		// eslint-disable-next-line @typescript-eslint/no-inferrable-types
		downloadLimit: number = 0,
		// eslint-disable-next-line @typescript-eslint/no-inferrable-types
		uploadLimit: number = 0,
	) {
		const body = new URLSearchParams({
			category: name,
			savePath,
			downloadLimit: downloadLimit.toString(),
			uploadLimit: uploadLimit.toString(),
		});

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/createCategory',
			headers: await this.buildHeaders({}),
			body,
		};

		return await this.doRequest(requestOptions);
	}

	public async editCategory(
		name: string,
		savePath?: string,
		downloadLimit?: number,
		uploadLimit?: number,
	) {
		const body: Record<string, string> = { category: name };
		if (savePath !== undefined) body.savePath = savePath;
		if (downloadLimit !== undefined) body.downloadLimit = downloadLimit.toString();
		if (uploadLimit !== undefined) body.uploadLimit = uploadLimit.toString();

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/editCategory',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams(body),
		};

		return await this.doRequest(requestOptions);
	}

	public async removeCategories(categories: string | string[]) {
		const categoryList = Array.isArray(categories) ? categories.join('\n') : categories;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/removeCategories',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ categories: categoryList }),
		};

		return await this.doRequest(requestOptions);
	}

	// ==================== Tags API ====================

	public async getTags() {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/tags',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async createTags(tags: string) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/createTags',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ tags }),
		};

		return await this.doRequest(requestOptions);
	}

	public async deleteTags(tags: string) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/torrents/deleteTags',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ tags }),
		};

		return await this.doRequest(requestOptions);
	}

	// ==================== RSS API ====================

	public async getRssFolders() {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: '/api/v2/rss/items',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async addRssFolder(name: string, parentPath?: string) {
		const body: Record<string, string> = { path: name };
		if (parentPath !== undefined) body.parentPath = parentPath;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/rss/addFolder',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams(body),
		};

		return await this.doRequest(requestOptions);
	}

	public async addRssFeed(url: string, name: string, parentPath?: string) {
		const body: Record<string, string> = { url, itemPath: name };
		if (parentPath !== undefined) body.parentPath = parentPath;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/rss/addFeed',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams(body),
		};

		return await this.doRequest(requestOptions);
	}

	public async removeRssItem(path: string) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/rss/removeItem',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ path }),
		};

		return await this.doRequest(requestOptions);
	}

	public async moveRssItem(itemPath: string, destPath: string) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/rss/moveItem',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				itemPath,
				destPath,
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async getRssItems(filter?: string) {
		let url = '/api/v2/rss/items';
		if (filter !== undefined) {
			url += `?filter=${encodeURIComponent(filter)}`;
		}

		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url,
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async markRssAsRead(itemPath: string, itemIds?: string) {
		const body: Record<string, string> = { itemPath };
		if (itemIds !== undefined) body.itemId = itemIds;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/rss/markAsRead',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams(body),
		};

		return await this.doRequest(requestOptions);
	}

	public async getRssRules() {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: '/api/v2/rss/rules',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async setRssRule(ruleName: string, ruleDef: Record<string, unknown>) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/rss/setRule',
			headers: await this.buildHeaders({}),
			body: {
				ruleName,
				def: JSON.stringify(ruleDef),
			},
		};

		return await this.doRequest(requestOptions);
	}

	public async renameRssRule(oldName: string, newName: string) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/rss/renameRule',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				oldRuleName: oldName,
				newRuleName: newName,
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async removeRssRule(ruleName: string) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/rss/removeRule',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ ruleName }),
		};

		return await this.doRequest(requestOptions);
	}

	// ==================== Search API ====================

	public async startSearch(pattern: string, plugins: string, category: string = 'all') {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/search/start',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				pattern,
				plugins,
				category,
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async stopSearch(id: number) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/search/stop',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ id: id.toString() }),
		};

		return await this.doRequest(requestOptions);
	}

	public async getSearchStatus(id?: number) {
		let url = '/api/v2/search/status';
		if (id !== undefined) {
			url += `?id=${id}`;
		}

		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url,
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async getSearchResults(id: number, limit: number = 100, offset: number = 0) {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: `/api/v2/search/results?id=${id}&limit=${limit}&offset=${offset}`,
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async deleteSearch(id: number) {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/search/delete',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ id: id.toString() }),
		};

		return await this.doRequest(requestOptions);
	}

	public async getSearchPlugins() {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: '/api/v2/search/plugins',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	public async installSearchPlugin(sources: string | string[]) {
		const sourceList = Array.isArray(sources) ? sources.join('\n') : sources;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/search/installPlugin',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ sources: sourceList }),
		};

		return await this.doRequest(requestOptions);
	}

	public async uninstallSearchPlugin(names: string | string[]) {
		const nameList = Array.isArray(names) ? names.join('\n') : names;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/search/uninstallPlugin',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({ names: nameList }),
		};

		return await this.doRequest(requestOptions);
	}

	public async enableSearchPlugin(names: string | string[], enable: boolean) {
		const nameList = Array.isArray(names) ? names.join('\n') : names;

		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/search/enablePlugin',
			headers: await this.buildHeaders({}),
			body: new URLSearchParams({
				names: nameList,
				enable: enable.toString(),
			}),
		};

		return await this.doRequest(requestOptions);
	}

	public async updateSearchPlugins() {
		const requestOptions: RequestOptions = {
			method: 'POST',
			baseURL: this.options.baseURL,
			url: '/api/v2/search/updatePlugins',
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}

	// ==================== Sync API ====================

	public async getTorrentMainData(rid: number = 0) {
		const requestOptions: RequestOptions = {
			method: 'GET',
			baseURL: this.options.baseURL,
			url: `/api/v2/sync/maindata?rid=${rid}`,
			headers: await this.buildHeaders({}),
		};

		return await this.doRequest(requestOptions);
	}
}
