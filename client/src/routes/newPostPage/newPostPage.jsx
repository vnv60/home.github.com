import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateFields = (inputs) => {
    const newErrors = {};

    if (!inputs.title) newErrors.title = "Trường này là bắt buộc.";
    if (!inputs.price) newErrors.price = "Trường này là bắt buộc.";
    if (!inputs.address) newErrors.address = "Trường này là bắt buộc.";
    if (!inputs.city) newErrors.city = "Trường này là bắt buộc.";
    if (!inputs.bedroom) newErrors.bedroom = "Trường này là bắt buộc.";
    if (!inputs.bathroom) newErrors.bathroom = "Trường này là bắt buộc.";
    if (!inputs.latitude) newErrors.latitude = "Trường này là bắt buộc.";
    if (!inputs.longitude) newErrors.longitude = "Trường này là bắt buộc.";
    //if (!inputs.desc) newErrors.desc = "Trường thông tin này là bắt buộc.";
    if (!inputs.pet) newErrors.pet = "Trường thông tin này là bắt buộc.";
    if (!inputs.income) newErrors.income = "Trường thông tin này là bắt buộc.";
    if (!inputs.size) newErrors.size = "Trường thông tin này là bắt buộc.";
    if (!inputs.school) newErrors.school = "Trường thông tin này là bắt buộc.";
    if (!inputs.bus) newErrors.bus = "Trường thông tin này là bắt buộc.";
    if (!inputs.restaurant) newErrors.restaurant = "Trường thông tin này là bắt buộc.";
    if (!inputs.maket) newErrors.maket = "Trường thông tin này là bắt buộc.";
    if (!inputs.supermaket) newErrors.supermaket = "Trường thông tin này là bắt buộc.";
    if (!inputs.hospital) newErrors.hospital = "Trường thông tin này là bắt buộc.";

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value.trim() !== "") {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
    const fieldErrors = validateFields(inputs);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
          maket: parseInt(inputs.maket),
          supermaket: parseInt(inputs.supermaket),
          hospital: parseInt(inputs.hospital),
        },
      });

      alert("Tạo bài đăng thành công!");

      if (res?.data?.id) {
        navigate("/" + res.data.id);
      } else {
        setErrors({ global: "Tạo bài đăng thất bại!" });
      }
    } catch (err) {
      console.error(err);
      setErrors({ global: err.message || "Đã xảy ra lỗi. Vui lòng thử lại sau." });
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Thêm bài đăng</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit} noValidate>
            <div className="item">
                          <label htmlFor="title">Tiêu đề <span style={{ color: "red" }}>*</span></label>
                          <input
                            id="title"
                            name="title"
                            type="text"
                            
                            onInput={handleInputChange}
                          />
                          {errors.title && <span className="inputError"style={{color: "red"}}>{errors.title}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="price">Giá <span style={{ color: "red" }}>*</span></label>
                          <input
                            id="price"
                            name="price"
                            type="number"
                            
                            onInput={handleInputChange}
                          />
                          {errors.price && <span className="inputError"style={{color: "red"}}>{errors.price}</span>}
                        </div>
                        <div className="item address">
                          <label htmlFor="address">Địa chỉ <span style={{ color: "red" }}>*</span></label>
                          <input
                            id="address"
                            name="address"
                            type="text"
                            
                            onInput={handleInputChange}
                          />
                          {errors.address && <span className="inputError"style={{color: "red"}}>{errors.address}</span>}
                        </div>
                        <div className="item description">
                          <label htmlFor="desc">Mô tả <span style={{ color: "red" }}>*</span></label>
                          <ReactQuill
                            theme="snow"
                            onChange={setValue}
                            value={value}
                            placeholder="Cập nhật mô tả của bạn ở đây..."
                            
                            onInput={handleInputChange}
                          />
                          
                        </div>
                        <div className="item">
                          <label htmlFor="city">Thành phố <span style={{"color": "red"}}>*</span></label>
                          <input id="city" name="city" type="text" onInput={handleInputChange}/>
                          {errors.city && <span className="inputError"style={{color: "red"}}>{errors.city}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="bedroom">Số phòng ngủ <span style={{"color": "red"}}>*</span></label>
                          <input min={1} id="bedroom" name="bedroom" type="number"  onInput={handleInputChange}/>
                          {errors.bedroom && <span className="inputError"style={{color: "red"}}>{errors.bedroom}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="bathroom">Só phòng tắm <span style={{"color": "red"}}>*</span></label>
                          <input min={1} id="bathroom" name="bathroom" type="number"  onInput={handleInputChange}/>
                          {errors.bathroom && <span className="inputError"style={{color: "red"}}>{errors.bathroom}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="latitude">Vĩ độ <span style={{"color": "red"}}>*</span></label>
                          <input id="latitude" name="latitude" type="text"  onInput={handleInputChange}/>
                          {errors.latitude && <span className="inputError"style={{color: "red"}}>{errors.latitude}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="longitude">Kinh độ <span style={{"color": "red"}}>*</span></label>
                          <input id="longitude" name="longitude" type="text"  onInput={handleInputChange}/>
                          {errors.longitude && <span className="inputError"style={{color: "red"}}>{errors.longitude}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="type">Loại <span style={{"color": "red"}}>*</span></label>
                          <select name="type" >
                            <option value="rent">Thuê</option>
                            <option value="buy">Mua</option>
                          </select>
                        </div>
                        <div className="item">
                          <label htmlFor="property">Bất động sản <span style={{"color": "red"}}>*</span></label>
                          <select name="property" >
                            <option value="apartment">Căn hộ</option>
                            <option value="house">Nhà</option>
                            <option value="condo">Chung cư</option>
                            <option value="land">Đất</option>
                          </select>
                        </div>
                        <div className="item">
                          <label htmlFor="utilities">Chính sách tiện ích <span style={{"color": "red"}}>*</span></label>
                          <select name="utilities" >
                            <option value="owner">Chủ sở hữu chịu trách nhiệm</option>
                            <option value="tenant">Người thuê nhà có trách nhiệm</option>
                            <option value="shared">Chia sẻ</option>
                          </select>
                        </div>
                        <div className="item">
                          <label htmlFor="pet">Chính sách thú cưng <span style={{"color": "red"}}>*</span></label>
                          <select name="pet">
                            <option value="allowed">Cho phép</option>
                            <option value="not-allowed">Không cho phép</option>
                          </select>
                        </div>
                        <div className="item">
                          <label htmlFor="income">Chính sách thu nhập <span style={{"color": "red"}}>*</span></label>
                            
                            <input id="income" name="income" type="text" onInput={handleInputChange}/>
                            {errors.income && <span className="inputError"style={{color: "red"}}>{errors.income}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="size">Tổng kích thước (m2) <span style={{"color": "red"}}>*</span></label>
                          <input min={0} id="size" name="size" type="number"  onInput={handleInputChange}/>
                          {errors.size && <span className="inputError"style={{color: "red"}}>{errors.size}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="school">Trường học <span style={{"color": "red"}}>*</span></label>
                          <input min={0} id="school" name="school" type="number" onInput={handleInputChange}/>
                          {errors.school && <span className="inputError"style={{color: "red"}}>{errors.school}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="bus">Xe bus <span style={{"color": "red"}}>*</span></label>
                          <input min={0} id="bus" name="bus" type="number" onInput={handleInputChange}/>
                          {errors.bus && <span className="inputError"style={{color: "red"}}>{errors.bus}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="restaurant">Nhà hàng <span style={{"color": "red"}}>*</span></label>
                          <input min={0} id="restaurant" name="restaurant" type="number" onInput={handleInputChange}/>
                          {errors.restaurant && <span className="inputError"style={{color: "red"}}>{errors.restaurant}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="maket">Chợ <span style={{"color": "red"}}>*</span></label>
                          <input min={0} id="maket" name="maket" type="number"  onInput={handleInputChange}/>
                          {errors.maket && <span className="inputError"style={{color: "red"}}>{errors.maket}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="supermaket">Siêu thị <span style={{"color": "red"}}>*</span></label>
                          <input min={0} id="supermaket" name="supermaket" type="number" onInput={handleInputChange}/>
                          {errors.supermaket && <span className="inputError"style={{color: "red"}}>{errors.supermaket}</span>}
                        </div>
                        <div className="item">
                          <label htmlFor="hospital">Bệnh viện <span style={{"color": "red"}}>*</span></label>
                          <input min={0} id="hospital" name="hospital" type="number"  onInput={handleInputChange}/>
                          {errors.hospital && <span className="inputError"style={{color: "red"}}>{errors.hospital}</span>}
                        </div>

            <button className="sendButton">Thêm</button>
            {errors.global && <span className="error global-error">{errors.global}</span>}
          </form>
        </div>
      </div>

      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="Uploaded" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "huynhhuunhan",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
