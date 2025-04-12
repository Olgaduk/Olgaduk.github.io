import { fetchBoards } from './api/boards';
import { fetchAssets } from './api/clips';
import ClientBoardsAndAssets from './components/ClientBoardsAndAssets';

export default async function Home() {

  const [boardsResponse, assetsResponse] = await Promise.all([
    fetchBoards(),
    fetchAssets({ cursor: null })
  ]);


  const boards = boardsResponse.data;
  const assets = assetsResponse.data.clips;
  const assetCursor = assetsResponse.pagination.cursor;
  const hasMoreAssets = assetsResponse.pagination.hasMore;
  const totalAssets = assetsResponse.data.total;


  return (
    <main>
      <ClientBoardsAndAssets
        initialAssets={assets}
        initialAssetCursor={assetCursor}
        initialHasMoreAssets={hasMoreAssets}
        totalAssets={totalAssets}
        boards={boards} />
    </main>
  );
}
