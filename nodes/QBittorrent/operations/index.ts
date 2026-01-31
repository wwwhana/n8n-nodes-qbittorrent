import { INodeProperties } from 'n8n-workflow';

export const operations = [
	// ============================================
	//         TORRENTS RESOURCE OPERATIONS
	// ============================================
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['torrents'],
			},
		},
		options: [
			{
				name: 'Add Tags',
				value: 'addTags',
				action: 'Add tags to torrent',
			},
			{
				name: 'Add Torrent',
				value: 'addTorrent',
				action: 'Add a torrent to the list',
			},
			{
				name: 'Add Trackers',
				value: 'addTrackers',
				action: 'Add trackers to torrent',
			},
			{
				name: 'Delete',
				value: 'deleteTorrent',
				action: 'Delete torrent s',
			},
			{
				name: 'Edit Tracker',
				value: 'editTracker',
				action: 'Edit torrent tracker',
			},
			{
				name: 'Get Torrent Properties',
				value: 'getTorrentProperties',
				action: 'Get torrent properties',
			},
			{
				name: 'Get Torrents',
				value: 'getTorrentsList',
				action: 'Get torrents list',
			},
			{
				name: 'Pause',
				value: 'pauseTorrent',
				action: 'Pause torrent s',
			},
			{
				name: 'Reannounce',
				value: 'reannounceTorrent',
				action: 'Reannounce torrent s',
			},
			{
				name: 'Recheck',
				value: 'recheckTorrent',
				action: 'Recheck torrent s',
			},
			{
				name: 'Remove Tags',
				value: 'removeTags',
				action: 'Remove tags from torrent',
			},
			{
				name: 'Remove Trackers',
				value: 'removeTrackers',
				action: 'Remove trackers from torrent',
			},
			{
				name: 'Resume',
				value: 'resumeTorrent',
				action: 'Resume torrent s',
			},
			{
				name: 'Set Category',
				value: 'setCategory',
				action: 'Set torrent category',
			},
			{
				name: 'Set Download Limit',
				value: 'setDownloadLimit',
				action: 'Set download speed limit',
			},
			{
				name: 'Set Location',
				value: 'setLocation',
				action: 'Set torrent save location',
			},
			{
				name: 'Set Priority',
				value: 'setPriority',
				action: 'Set torrent priority',
			},
			{
				name: 'Set Upload Limit',
				value: 'setUploadLimit',
				action: 'Set upload speed limit',
			},
		],
		default: 'addTorrent',
	},
	// ============================================
	//       APPLICATION RESOURCE OPERATIONS
	// ============================================
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['application'],
			},
		},
		options: [
			{
				name: 'Get API Version',
				value: 'getAppVersion',
				action: 'Get API version',
			},
			{
				name: 'Get Build Info',
				value: 'getBuildInfo',
				action: 'Get build information',
			},
			{
				name: 'Get Preferences',
				value: 'getPreferences',
				action: 'Get application preferences',
			},
			{
				name: 'Get Version',
				value: 'getVersion',
				action: 'Get q bittorrent version',
			},
			{
				name: 'Get Web API Version',
				value: 'getWebApiVersion',
				action: 'Get web api version',
			},
			{
				name: 'Set Preferences',
				value: 'setPreferences',
				action: 'Set application preferences',
			},
		],
		default: 'getAppVersion',
	},
	// ============================================
	//         LOGS RESOURCE OPERATIONS
	// ============================================
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['logs'],
			},
		},
		options: [
			{
				name: 'Get Logs',
				value: 'getLogs',
				action: 'Get application logs',
			},
			{
				name: 'Peek Log',
				value: 'peekLog',
				action: 'Peek at last log lines',
			},
		],
		default: 'getLogs',
	},
	// ============================================
	//       TRANSFERS RESOURCE OPERATIONS
	// ============================================
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transfers'],
			},
		},
		options: [
			{
				name: 'Get Info',
				value: 'getTransferInfo',
				action: 'Get transfer information',
			},
			{
				name: 'Set Download Limit',
				value: 'setDownloadLimit',
				action: 'Set global download limit',
			},
			{
				name: 'Set Upload Limit',
				value: 'setUploadLimit',
				action: 'Set global upload limit',
			},
			{
				name: 'Toggle Speed Limits Mode',
				value: 'toggleSpeedLimitMode',
				action: 'Toggle alternative speed limits',
			},
		],
		default: 'getTransferInfo',
	},
	// ============================================
	//       CATEGORIES RESOURCE OPERATIONS
	// ============================================
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['categories'],
			},
		},
		options: [
			{
				name: 'List Categories',
				value: 'listCategories',
				action: 'List all categories',
			},
			{
				name: 'Add Category',
				value: 'addCategory',
				action: 'Add a new category',
			},
			{
				name: 'Edit Category',
				value: 'editCategory',
				action: 'Edit existing category',
			},
			{
				name: 'Remove Category',
				value: 'removeCategory',
				action: 'Remove a category',
			},
		],
		default: 'listCategories',
	},
	// ============================================
	//          TAGS RESOURCE OPERATIONS
	// ============================================
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tags'],
			},
		},
		options: [
			{
				name: 'List Tags',
				value: 'listTags',
				action: 'List all tags',
			},
			{
				name: 'Add Tags',
				value: 'addTags',
				action: 'Add new tags',
			},
			{
				name: 'Remove Tags',
				value: 'removeTags',
				action: 'Remove tags',
			},
		],
		default: 'listTags',
	},
	// ============================================
	//          RSS RESOURCE OPERATIONS
	// ============================================
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['rss'],
			},
		},
		options: [
			{
				name: 'Add Feed',
				value: 'addFeed',
				action: 'Add RSS feed',
			},
			{
				name: 'Get Feed Items',
				value: 'getFeedItems',
				action: 'Get items from RSS feed',
			},
			{
				name: 'Get Feeds',
				value: 'getFeeds',
				action: 'Get all RSS feeds',
			},
			{
				name: 'Get Rules',
				value: 'getRules',
				action: 'Get RSS download rules',
			},
			{
				name: 'Mark as Read',
				value: 'markAsRead',
				action: 'Mark feed items as read',
			},
			{
				name: 'Move Feed',
				value: 'moveFeed',
				action: 'Move RSS feed',
			},
			{
				name: 'Remove Feed',
				value: 'removeFeed',
				action: 'Remove RSS feed',
			},
			{
				name: 'Remove Rule',
				value: 'removeRule',
				action: 'Remove RSS download rule',
			},
			{
				name: 'Rename Rule',
				value: 'renameRule',
				action: 'Rename RSS download rule',
			},
			{
				name: 'Set Rule',
				value: 'setRule',
				action: 'Set RSS download rule',
			},
		],
		default: 'addFeed',
	},
	// ============================================
	//         SEARCH RESOURCE OPERATIONS
	// ============================================
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['search'],
			},
		},
		options: [
			{
				name: 'Delete Search',
				value: 'deleteSearch',
				action: 'Delete a search',
			},
			{
				name: 'Enable Plugin',
				value: 'enablePlugin',
				action: 'Enable search plugin',
			},
			{
				name: 'Get Search Plugins',
				value: 'getSearchPlugins',
				action: 'Get search plugins',
			},
			{
				name: 'Get Search Results',
				value: 'getSearchResults',
				action: 'Get search results',
			},
			{
				name: 'Get Search Status',
				value: 'getSearchStatus',
				action: 'Get search status',
			},
			{
				name: 'Install Plugin',
				value: 'installPlugin',
				action: 'Install search plugin',
			},
			{
				name: 'Start Search',
				value: 'startSearch',
				action: 'Start a torrent search',
			},
			{
				name: 'Stop Search',
				value: 'stopSearch',
				action: 'Stop a running search',
			},
			{
				name: 'Uninstall Plugin',
				value: 'uninstallPlugin',
				action: 'Uninstall search plugin',
			},
			{
				name: 'Update Plugins',
				value: 'updatePlugins',
				action: 'Update search plugins',
			},
		],
		default: 'startSearch',
	},
] satisfies INodeProperties[];
