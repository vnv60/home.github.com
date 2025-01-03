import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import Footer from "../../components/Footer/footer";

function ListPage() {
  const data = useLoaderData();

  return (
    <div className="pageContainer">
  <div className="listPage">
    <div className="listContainer">
      {/* Nội dung danh sách */}
      <div className="wrapper">
          <Filter />
          <Suspense fallback={<p>Đang tải dữ liệu</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Lỗi tải lên</p>}
            >
              {(postResponse) =>
                postResponse.data.map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
        </div>

    </div>
    <div className="mapContainer">
      {/* Nội dung bản đồ */}
      <Suspense fallback={<p>Đang tải dữ liệu</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Lỗi tải lên</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>

    </div>
  </div>
  
<Footer/>
</div>

  );
}

export default ListPage;

