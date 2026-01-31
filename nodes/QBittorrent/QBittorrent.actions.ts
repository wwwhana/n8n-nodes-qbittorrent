import { IExecuteFunctions } from 'n8n-workflow';
import {
	AddTorrentOptions,
	QBittorrentClient,
} from '../../lib/qbittorrent-client/qbittorrent-client';

// ==================== Torrent Actions ====================

export async function addTorrent(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const options: AddTorrentOptions = {
		urls: executeContext.getNodeParameter('urls', itemIndex) as string,
		...(executeContext.getNodeParameter('additionalParameters', itemIndex, {}) as Omit<
			AddTorrentOptions,
			'urls'
		>),
	};

	return client.addTorrent(options);
}

export async function getTorrentsList(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getTorrentsList();
}

export async function getTorrentProperties(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hash = executeContext.getNodeParameter('hash', itemIndex) as string;
	return client.getTorrentProperties(hash);
}

export async function pauseTorrent(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	return client.pauseTorrent(hashes);
}

export async function resumeTorrent(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	return client.resumeTorrent(hashes);
}

export async function deleteTorrent(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	const deleteFiles = executeContext.getNodeParameter('deleteFiles', itemIndex, false) as boolean;
	return client.deleteTorrent(hashes, deleteFiles);
}

export async function recheckTorrent(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	return client.recheckTorrent(hashes);
}

export async function reannounceTorrent(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	return client.reannounceTorrent(hashes);
}

export async function setCategory(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	const category = executeContext.getNodeParameter('category', itemIndex) as string;
	return client.setTorrentCategory(hashes, category);
}

export async function setLocation(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	const location = executeContext.getNodeParameter('location', itemIndex) as string;
	return client.setTorrentLocation(hashes, location);
}

export async function setPriority(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	const priority = executeContext.getNodeParameter('priority', itemIndex) as number;
	return client.setTorrentPriority(hashes, priority);
}

export async function setDownloadLimit(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	const limit = executeContext.getNodeParameter('limit', itemIndex) as number;
	return client.setTorrentDownloadLimit(hashes, limit);
}

export async function setUploadLimit(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	const limit = executeContext.getNodeParameter('limit', itemIndex) as number;
	return client.setTorrentUploadLimit(hashes, limit);
}

export async function addTrackers(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hash = executeContext.getNodeParameter('hash', itemIndex) as string;
	const urls = executeContext.getNodeParameter('urls', itemIndex) as string;
	return client.addTrackers(hash, urls);
}

export async function editTracker(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hash = executeContext.getNodeParameter('hash', itemIndex) as string;
	const originalUrl = executeContext.getNodeParameter('originalUrl', itemIndex) as string;
	const newUrl = executeContext.getNodeParameter('newUrl', itemIndex) as string;
	return client.editTracker(hash, originalUrl, newUrl);
}

export async function removeTrackers(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hash = executeContext.getNodeParameter('hash', itemIndex) as string;
	const urls = executeContext.getNodeParameter('urls', itemIndex) as string;
	return client.removeTrackers(hash, urls);
}

export async function addTorrentTags(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	const tags = executeContext.getNodeParameter('tags', itemIndex) as string;
	return client.addTorrentTags(hashes, tags);
}

export async function removeTorrentTags(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const hashes = executeContext.getNodeParameter('hashes', itemIndex) as string;
	const tags = executeContext.getNodeParameter('tags', itemIndex) as string;
	return client.removeTorrentTags(hashes, tags);
}

// ==================== Application Actions ====================

export async function getAppVersion(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getAppVersion();
}

export async function getVersion(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getAppVersion();
}

export async function getWebApiVersion(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getWebApiVersion();
}

export async function getPreferences(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getPreferences();
}

export async function setPreferences(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const preferences = executeContext.getNodeParameter('json', itemIndex) as Record<string, unknown>;
	return client.setPreferences(preferences);
}

export async function getBuildInfo(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getBuildInfo();
}

// ==================== Log Actions ====================

export async function getLogs(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const normal = executeContext.getNodeParameter('normal', itemIndex, true) as boolean;
	const info = executeContext.getNodeParameter('info', itemIndex, true) as boolean;
	return client.getLogs(normal, info);
}

export async function peekLog(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const lastLines = executeContext.getNodeParameter('lastLines', itemIndex, 1000) as number;
	return client.peekLog(lastLines);
}

// ==================== Transfer Actions ====================

export async function getTransferInfo(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getTransferInfo();
}

export async function setTransferDownloadLimit(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const limit = executeContext.getNodeParameter('limit', itemIndex) as number;
	return client.setGlobalDownloadLimit(limit);
}

export async function setTransferUploadLimit(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const limit = executeContext.getNodeParameter('limit', itemIndex) as number;
	return client.setGlobalUploadLimit(limit);
}

export async function toggleSpeedLimitMode(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.toggleSpeedLimitsMode();
}

// ==================== Category Actions ====================

export async function listCategories(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getCategories();
}

export async function addCategory(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const name = executeContext.getNodeParameter('name', itemIndex) as string;
	const savePath = executeContext.getNodeParameter('savePath', itemIndex) as string;
	const downloadLimit = executeContext.getNodeParameter('downloadLimit', itemIndex, 0) as number;
	const uploadLimit = executeContext.getNodeParameter('uploadLimit', itemIndex, 0) as number;
	return client.createCategory(name, savePath, downloadLimit, uploadLimit);
}

export async function editCategory(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const name = executeContext.getNodeParameter('name', itemIndex) as string;
	const savePath = executeContext.getNodeParameter('savePath', itemIndex) as string;
	const downloadLimit = executeContext.getNodeParameter('downloadLimit', itemIndex) as number;
	const uploadLimit = executeContext.getNodeParameter('uploadLimit', itemIndex) as number;
	return client.editCategory(name, savePath, downloadLimit, uploadLimit);
}

export async function removeCategory(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const categories = executeContext.getNodeParameter('categories', itemIndex) as string;
	return client.removeCategories(categories);
}

// ==================== Tag Actions ====================

export async function listTags(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getTags();
}

export async function addTags(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const tags = executeContext.getNodeParameter('tags', itemIndex) as string;
	return client.createTags(tags);
}

export async function removeTags(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const tags = executeContext.getNodeParameter('tags', itemIndex) as string;
	return client.deleteTags(tags);
}

// ==================== RSS Actions ====================

export async function addFeed(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const url = executeContext.getNodeParameter('url', itemIndex) as string;
	const name = executeContext.getNodeParameter('name', itemIndex) as string;
	const parentPath = executeContext.getNodeParameter('parentPath', itemIndex, '') as string;
	return client.addRssFeed(url, name, parentPath || undefined);
}

export async function removeFeed(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const path = executeContext.getNodeParameter('path', itemIndex) as string;
	return client.removeRssItem(path);
}

export async function moveFeed(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const itemPath = executeContext.getNodeParameter('itemPath', itemIndex) as string;
	const destPath = executeContext.getNodeParameter('destPath', itemIndex) as string;
	return client.moveRssItem(itemPath, destPath);
}

export async function getFeeds(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getRssFolders();
}

export async function getFeedItems(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const filter = executeContext.getNodeParameter('filter', itemIndex, '') as string;
	return client.getRssItems(filter || undefined);
}

export async function markAsRead(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const itemPath = executeContext.getNodeParameter('itemPath', itemIndex) as string;
	const itemIds = executeContext.getNodeParameter('itemIds', itemIndex, '') as string;
	return client.markRssAsRead(itemPath, itemIds || undefined);
}

export async function setRule(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const ruleName = executeContext.getNodeParameter('ruleName', itemIndex) as string;
	const ruleDef = executeContext.getNodeParameter('ruleDef', itemIndex) as Record<string, unknown>;
	return client.setRssRule(ruleName, ruleDef);
}

export async function renameRule(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const oldName = executeContext.getNodeParameter('oldName', itemIndex) as string;
	const newName = executeContext.getNodeParameter('newName', itemIndex) as string;
	return client.renameRssRule(oldName, newName);
}

export async function getRules(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getRssRules();
}

export async function removeRule(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const ruleName = executeContext.getNodeParameter('ruleName', itemIndex) as string;
	return client.removeRssRule(ruleName);
}

// ==================== Search Actions ====================

export async function startSearch(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const pattern = executeContext.getNodeParameter('pattern', itemIndex) as string;
	const plugins = executeContext.getNodeParameter('plugins', itemIndex) as string;
	const category = executeContext.getNodeParameter('category', itemIndex, 'all') as string;
	return client.startSearch(pattern, plugins, category);
}

export async function stopSearch(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const id = executeContext.getNodeParameter('id', itemIndex) as number;
	return client.stopSearch(id);
}

export async function getSearchStatus(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const id = executeContext.getNodeParameter('id', itemIndex) as number;
	return client.getSearchStatus(id);
}

export async function getSearchResults(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const id = executeContext.getNodeParameter('id', itemIndex) as number;
	const limit = executeContext.getNodeParameter('limit', itemIndex, 100) as number;
	const offset = executeContext.getNodeParameter('offset', itemIndex, 0) as number;
	return client.getSearchResults(id, limit, offset);
}

export async function deleteSearch(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const id = executeContext.getNodeParameter('id', itemIndex) as number;
	return client.deleteSearch(id);
}

export async function getSearchPlugins(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.getSearchPlugins();
}

export async function installPlugin(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const sources = executeContext.getNodeParameter('sources', itemIndex) as string;
	return client.installSearchPlugin(sources);
}

export async function uninstallPlugin(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const names = executeContext.getNodeParameter('names', itemIndex) as string;
	return client.uninstallSearchPlugin(names);
}

export async function enablePlugin(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	const names = executeContext.getNodeParameter('names', itemIndex) as string;
	const enable = executeContext.getNodeParameter('enable', itemIndex, true) as boolean;
	return client.enableSearchPlugin(names, enable);
}

export async function updatePlugins(
	executeContext: IExecuteFunctions,
	itemIndex: number,
	client: QBittorrentClient,
) {
	return client.updateSearchPlugins();
}
