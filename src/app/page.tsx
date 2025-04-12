import { fetchBoards } from './api/boards';
import { fetchAssets } from './api/clips';
import BoardsAndAssets from './components/BoardsAndAssets';

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
      <BoardsAndAssets
        initialAssets={assets}
        initialAssetCursor={assetCursor}
        initialHasMoreAssets={hasMoreAssets}
        totalAssets={totalAssets}
        boards={boards} />
    </main>
  );
}
