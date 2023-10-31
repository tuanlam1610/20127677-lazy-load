import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const App = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [searchText, setSearchText] = useState("cat");
  const [finalSearch, setFinalSearch] = useState("");
  const [fetchingState, setFetchingState] = useState({
    currentPage: 0,
    totalPage: -1,
    total: 0,
  });
  useEffect(() => {
    if (!finalSearch) return;
    loadImages();
  }, [finalSearch]);
  const loadImages = async () => {
    const response = await fetch(
      `https://api.unsplash.com/search/photos/?query=${searchText}&client_id=${
        import.meta.env.VITE_REACT_APP_UNSPLASH_CLIENT_ID
      }&per_page=10&page=${fetchingState.currentPage + 1}`
    );
    const imagesResult = await response.json();
    console.log(imagesResult);
    setFetchingState({
      currentPage: fetchingState.currentPage + 1,
      totalPage: imagesResult.total_pages,
      total: imagesResult.total,
    });
    console.log(fetchingState.currentPage);
    setImageUrls([
      ...imageUrls,
      ...imagesResult.results.map((image) => image.urls.small),
    ]);
  };

  return (
    <div className="App">
      <div>
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          onClick={() => {
            setFetchingState({
              currentPage: 0,
              totalPage: -1,
              total: 0,
            });
            setImageUrls([]);
            setFinalSearch(searchText);
          }}
        >
          Search
        </button>
      </div>
      <InfiniteScroll
        dataLength={imageUrls.length} //This is important field to render the next data
        next={loadImages}
        hasMore={fetchingState.currentPage < fetchingState.totalPage}
        loader={
          <img
            src="https://media.tenor.com/hlKEXPvlX48AAAAi/loading-loader.gif"
            alt="Loading..."
            height="75"
          />
        }
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>No more records</b>
          </p>
        }
      >
        {imageUrls.map((url) => (
          <img width="300" height="300" src={url} key={url} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default App;
