/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from "react";

// routing
import { Link, useHistory } from "react-router-dom";

// redux
import { connect, useDispatch, useSelector } from "react-redux";



//action
import { insertPost, editFakePost } from "../../store/post/action";
import { getFakeUser } from "../../store/FakeUser/Action";
import { baseURL } from "../../util/config";
// import { baseURL } from "../../util/config";

const FakePostPage = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const detail = JSON.parse(localStorage.getItem("fakePost"));
  
  const { user } = useSelector((state) => state.fakeUser);

  useEffect(() => {
    dispatch(getFakeUser("", "", "ALL", "ALL", "ALL"));
  }, [dispatch]);

  const [show, setShow] = useState("");

  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [user_, setUser] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [postId, setPostId] = useState("");
  const [imageType, setImageType] = useState("0");
  // const [user,setUser] = useState([]);
  const [errors, setError] = useState({
    image: "",
    show: "",
    user_: "",
    imagePath: "",
  });

  useEffect(() => {
    if (detail) {
      setShow(detail.showPost.toString());
      setUser(detail?.userId?._id);
      setLocation(detail.location);
      setCaption(detail.caption);
      setImagePath(baseURL + detail.post);
      setPostId(detail._id);
      setImageType(detail?.fakePostType);
    }
  }, []);

  const HandleInputImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = () => {
    if (
      !image ||
      !imagePath ||
      !user_ ||
      user === "Select user" ||
      !show ||
      !location ||
      !caption
    ) {
      const errors = {};
      if (!location) errors.location = "Please Enter Location";
      if (!image || !imagePath) errors.image = "Please select an post!";
      if (!user_ || user === "Select user") errors.user_ = "User Required";
      if (!caption) errors.caption = "Please Enter Caption";
      if (!show) errors.show = "Please Select Video Show Type";

      return setError({ ...errors });
    } else {
      
      const formData = new FormData();
      formData.append("showPost", parseInt(show));
      formData.append("userId", user_);
      formData.append("location", location);
      formData.append("caption", caption);
      formData.append("post", image);
      formData.append("allowComment", true);

      if (postId) {
        props.editFakePost(postId, formData);
      } else {
        props.insertPost(formData);
      }
    }
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-light">Fake Post Dialog</h3>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-danger">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/admin/post" className="text-danger">
                    Post
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Dialog
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-body card-overflow">
              <div class="d-sm-flex align-items-center justify-content-between mb-4"></div>

              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="text-gray mb-2">user</label>

                      <>
                        <select
                          class="form-select form-control"
                          aria-label="Default select example"
                          value={user_}
                          onChange={(e) => {
                            setUser(e.target.value);
                            if (e.target.value === "Select user") {
                              return setError({
                                ...errors,
                                user_: "Please select a user!",
                              });
                            } else {
                              return setError({
                                ...errors,
                                user_: "",
                              });
                            }
                          }}
                        >
                          <option value="Select user">Select user</option>
                          {user?.map((user) => {
                            return user.name == detail?.userId?.name ? (
                              <option value={user?._id} selected>
                                {user?.name}
                              </option>
                            ) : (
                              <option value={user?._id}>{user?.name}</option>
                            );
                          })}
                        </select>
                        {errors.user_ && (
                          <div className="ml-2 mt-1">
                            {errors.user_ && (
                              <div className="pl-1 text__left">
                                <span className="text-red">{errors.user_}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    </div>
                  </div>

                  <div className="col-md-6 d-flex justify-content-start mt-5">
                    <label className="mb-2 text-gray">Show Post : </label>
                    <div class="form-check">
                      <input
                        class="form-check-input mx-2"
                        type="radio"
                        name="show"
                        id="public"
                        value="0"
                        checked={show === "0" ? true : false}
                        onClick={(e) => {
                          setShow(e.target.value);
                        }}
                      />
                      <label class="form-check-label" for="public">
                        Public
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input mx-2"
                        type="radio"
                        name="show"
                        id="private"
                        value="1"
                        checked={show === "1" ? true : false}
                        onClick={(e) => {
                          setShow(e.target.value);
                        }}
                      />
                      <label class="form-check-label" for="private">
                        Private
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6"></div>
                  <div className="col-md-6">
                    {errors.show && (
                      <div className="ml-2 mt-1">
                        {errors.show && (
                          <div className="pl-1 text__left">
                            <span className="text-red">{errors.show}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="form-group ">
                      <label className="mb-2 text-gray">location</label>
                      <input
                        type="text"
                        className="form-control"
                        required=""
                        placeholder="location"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              location: "Location is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              location: "",
                            });
                          }
                        }}
                      />
                      {errors.location && (
                        <div className="ml-2 mt-1">
                          {errors.location && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.location}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group ">
                      <label className="mb-2 text-gray">Caption</label>
                      <textarea
                        rows={3}
                        cols={30}
                        className="form-control"
                        required=""
                        placeholder="caption"
                        value={caption}
                        onChange={(e) => {
                          setCaption(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              caption: "Caption is Required!",
                            });
                          } else {
                            return setError({
                              ...errors,
                              caption: "",
                            });
                          }
                        }}
                      />
                      {errors.caption && (
                        <div className="ml-2 mt-1">
                          {errors.caption && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.caption}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="mb-2 text-gray">Post Type</label>
                  <input
                    type="file"
                    id="post"
                    className="form-control"
                    accept="image/jpg ,image/jpeg ,image/png"
                    required=""
                    hidden
                    onChange={HandleInputImage}
                  />
                  <div className="row">
                    <div
                      className="col-md-3 pointer-cursor"
                      style={{
                        height: 100,
                        width: 100,
                        border: "2px dashed gray",
                        textAlign: "center",
                        margin: 10,
                      }}
                      onClick={() => document.getElementById("post").click()}
                    >
                      <i
                        className="fas fa-plus"
                        style={{ paddingTop: 20, fontSize: 60 }}
                      ></i>
                    </div>
                    <div className="col-md-9">
                      {imagePath && (
                        <>
                          <img
                            height="80px"
                            width="80px"
                            alt="app"
                            controls
                            src={imagePath}
                            style={{
                              boxShadow: "0 5px 15px 0 rgb(105 103 103 / 30%)",
                              border: "2px solid #fff",
                              borderRadius: 10,
                              marginTop: 10,
                              float: "left",
                              objectFit: "cover",
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  {errors.image && (
                    <div className="ml-2 mt-1">
                      {errors.image && (
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.image}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className={imagePath ? "mt-5 pt-5" : "mt-5"}>
                    <button
                      type="button"
                      className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                      onClick={() => {
                        history.push("/admin/post/fake");
                      }}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-round float__right btn-danger"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { insertPost, editFakePost, getFakeUser })(
  FakePostPage
);
