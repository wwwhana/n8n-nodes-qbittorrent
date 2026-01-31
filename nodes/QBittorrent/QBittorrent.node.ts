import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeConnectionType,
	NodeExecutionWithMetadata,
} from 'n8n-workflow';
import * as actions from './QBittorrent.actions';
import {
	QBittorrentApiCredentials,
	QBittorrentApiName,
} from '../../credentials/QBittorrentApi.credentials';
import {
	QBittorrentClient,
	QBittorrentClientConstructorOptions,
} from '../../lib/qbittorrent-client/qbittorrent-client';
import { sha512 } from '../../lib/qbittorrent-client/utils/sha512';
import { operations } from './operations';
import { fields } from './fields';

// Documentation
// https://docs.n8n.io/integrations/creating-nodes/overview/
// https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-5.0)

export class QBittorrent implements INodeType {
	static client:
		| {
				identifier: string;
				instance: QBittorrentClient;
		  }
		| undefined;

	description: INodeTypeDescription = {
		displayName: 'qBittorrent',
		name: 'qBittorrent',
		icon: 'file:qbittorrent.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Communicate with your qBittorrent instance web API',
		credentials: [
			{
				name: QBittorrentApiName,
				required: true,
			},
		],
		defaults: {
			name: 'qBittorrent',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [NodeConnectionType.Main],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionType.Main],
		requestDefaults: {
			baseURL: '={{$credentials["url"] + "/api/v2"}}',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Application',
						value: 'application',
					},
					{
						name: 'Category',
						value: 'categories',
					},
					{
						name: 'Log',
						value: 'logs',
					},
					{
						name: 'RSS',
						value: 'rss',
					},
					{
						name: 'Search',
						value: 'search',
					},
					{
						name: 'Tag',
						value: 'tags',
					},
					{
						name: 'Torrent',
						value: 'torrents',
					},
					{
						name: 'Transfer',
						value: 'transfers',
					},
				],
				default: 'torrents',
			},

			...operations,
			...fields,
		],
	};

	public async execute(
		this: IExecuteFunctions,
	): Promise<INodeExecutionData[][] | NodeExecutionWithMetadata[][] | null> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			const credentials = (await this.getCredentials(
				QBittorrentApiName,
				i,
			)) as QBittorrentApiCredentials;
			const client = await QBittorrent.getClientInstance({
				baseURL: credentials.url as string,
				requestHelper: { request: this.helpers.httpRequest },
				auth: {
					username: credentials.username,
					password: credentials.password,
				},
			});

			const action = this.getNodeParameter('operation', i);

			// Map action to function
			const actionMap: Record<string, () => Promise<unknown>> = {
				// Torrent operations
				addTorrent: () => actions.addTorrent(this, i, client),
				getTorrentsList: () => actions.getTorrentsList(this, i, client),
				getTorrentProperties: () => actions.getTorrentProperties(this, i, client),
				pauseTorrent: () => actions.pauseTorrent(this, i, client),
				resumeTorrent: () => actions.resumeTorrent(this, i, client),
				deleteTorrent: () => actions.deleteTorrent(this, i, client),
				recheckTorrent: () => actions.recheckTorrent(this, i, client),
				reannounceTorrent: () => actions.reannounceTorrent(this, i, client),
				setCategory: () => actions.setCategory(this, i, client),
				setLocation: () => actions.setLocation(this, i, client),
				setPriority: () => actions.setPriority(this, i, client),
				setDownloadLimit: () => actions.setDownloadLimit(this, i, client),
				setUploadLimit: () => actions.setUploadLimit(this, i, client),
				addTrackers: () => actions.addTrackers(this, i, client),
				editTracker: () => actions.editTracker(this, i, client),
				removeTrackers: () => actions.removeTrackers(this, i, client),
				addTorrentTags: () => actions.addTorrentTags(this, i, client),
				removeTorrentTags: () => actions.removeTorrentTags(this, i, client),
				// Application operations
				getAppVersion: () => actions.getAppVersion(this, i, client),
				getVersion: () => actions.getVersion(this, i, client),
				getWebApiVersion: () => actions.getWebApiVersion(this, i, client),
				getPreferences: () => actions.getPreferences(this, i, client),
				setPreferences: () => actions.setPreferences(this, i, client),
				getBuildInfo: () => actions.getBuildInfo(this, i, client),
				// Log operations
				getLogs: () => actions.getLogs(this, i, client),
				peekLog: () => actions.peekLog(this, i, client),
				// Transfer operations
				getTransferInfo: () => actions.getTransferInfo(this, i, client),
				setTransferDownloadLimit: () => actions.setTransferDownloadLimit(this, i, client),
				setTransferUploadLimit: () => actions.setTransferUploadLimit(this, i, client),
				toggleSpeedLimitMode: () => actions.toggleSpeedLimitMode(this, i, client),
				// Category operations
				listCategories: () => actions.listCategories(this, i, client),
				addCategory: () => actions.addCategory(this, i, client),
				editCategory: () => actions.editCategory(this, i, client),
				removeCategory: () => actions.removeCategory(this, i, client),
				// Tag operations
				listTags: () => actions.listTags(this, i, client),
				addTags: () => actions.addTags(this, i, client),
				removeTags: () => actions.removeTags(this, i, client),
				// RSS operations
				addFeed: () => actions.addFeed(this, i, client),
				removeFeed: () => actions.removeFeed(this, i, client),
				moveFeed: () => actions.moveFeed(this, i, client),
				getFeeds: () => actions.getFeeds(this, i, client),
				getFeedItems: () => actions.getFeedItems(this, i, client),
				markAsRead: () => actions.markAsRead(this, i, client),
				setRule: () => actions.setRule(this, i, client),
				renameRule: () => actions.renameRule(this, i, client),
				getRules: () => actions.getRules(this, i, client),
				removeRule: () => actions.removeRule(this, i, client),
				// Search operations
				startSearch: () => actions.startSearch(this, i, client),
				stopSearch: () => actions.stopSearch(this, i, client),
				getSearchStatus: () => actions.getSearchStatus(this, i, client),
				getSearchResults: () => actions.getSearchResults(this, i, client),
				deleteSearch: () => actions.deleteSearch(this, i, client),
				getSearchPlugins: () => actions.getSearchPlugins(this, i, client),
				installPlugin: () => actions.installPlugin(this, i, client),
				uninstallPlugin: () => actions.uninstallPlugin(this, i, client),
				enablePlugin: () => actions.enablePlugin(this, i, client),
				updatePlugins: () => actions.updatePlugins(this, i, client),
			};

			if (actionMap[action]) {
				const result = await actionMap[action]();
				returnData.push({ json: result as IDataObject });
			} else {
				throw new NodeApiError(this.getNode(), {
					message: `Unknown action: ${action}`,
					description: 'The selected operation is not implemented.',
				} as never);
			}
		}

		return this.prepareOutputData(returnData);
	}

	public static async getClientInstance(options: QBittorrentClientConstructorOptions) {
		const clearIdentifier = `${options.baseURL}-${options.auth?.username}-${options.auth?.password}`;
		const hash = await sha512(clearIdentifier);

		if (QBittorrent.client?.identifier !== hash) {
			QBittorrent.client = {
				identifier: hash,
				instance: new QBittorrentClient(options),
			};
		}
		return QBittorrent.client.instance;
	}
}
