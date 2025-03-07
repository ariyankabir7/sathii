import React, { useEffect, useState } from "react";

//dayjs
import dayjs from "dayjs";

//jquery
import $ from "jquery";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//routing
import { Link, useHistory } from "react-router-dom";

//MUI
import { Tooltip } from "@mui/material";

// import arraySort from "array-sort";

//image
import Male from "../../assets/images/male.png";



//pagination
import Pagination from "../../pages/Pagination";

//Date Range Picker
import { DateRangePicker } from "react-date-range";
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//MUI icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//action
import {
  getFakeUser,
  handleBlockUnblockSwitch,
} from "../../store/FakeUser/Action";
import { baseURL } from "../../util/config";

const FakeUser = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  

  const [data, setData] = useState([]);

  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("ALL");

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");

  useEffect(() => {
    $("#card").click(() => {
      $("#datePicker").removeClass("show");
    });
  }, []);

  const maxDate = new Date();

  useEffect(() => {
    dispatch(
      getFakeUser(activePage, rowsPerPage, search, sDate, eDate, "Fake")
    );
  }, [activePage, rowsPerPage, search, sDate, eDate]);

  const { user, activeUser, male, female, totalUser } = useSelector(
    (state) => state.fakeUser
  );
  useEffect(() => {
    setData(user);
  }, [user]);

  useEffect(() => {
    if (date.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
    $("#datePicker").removeClass("show");
    setData(user);
  }, [date, user]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", `${baseURL}` + "storage/male.png");
    });
  });

  const handleBlockUnblockSwitch_ = (userId) => {
    
    dispatch(handleBlockUnblockSwitch(userId));
  };

  const handleUserInfo = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.removeItem("userFollow");
    history.push("/admin/user/detail");
  };
  const handleUserHistory = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    history.push("/admin/user/history");
  };

  const getAllUser = () => {
    setActivePage(1);
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").removeClass("show");
    dispatch(getFakeUser(activePage, rowsPerPage, search, sDate, eDate));
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggleClass("collapse");
  };

  const handleAddFakeUser = () => {
    localStorage.removeItem("fakeUser");
    history.push("/admin/fake/fakeUserdialog");
  };
  const handleEdit = (data) => {
    localStorage.setItem("fakeUser", JSON.stringify(data));

    history.push("/admin/fake/fakeUserdialog");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Fake User</h3>
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
                <li className="breadcrumb-item active" aria-current="page">
                  Fake User
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div class="row ">
        <div className=" mb-2">
          <div className="my-2">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => handleAddFakeUser(data)}
            >
              <i className="fas fa-plus fa-lg me-2 "></i>
              <span className="">New</span>
            </button>
          </div>
        </div>

        <div class="col">
          <div class="card" id="card">
            <div className="card-header pb-0">
              <div className="row my-3">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
                  <div className="text-left align-sm-left d-md-flex d-lg-flex justify-content-start">
                    <button
                      className="btn btn-info"
                      style={{ marginRight: 5 }}
                      onClick={getAllUser}
                    >
                      All
                    </button>
                    <button
                      className="collapsed btn btn-info ml-5"
                      value="check"
                      data-toggle="collapse"
                      data-target="#datePicker"
                      onClick={collapsedDatePicker}
                    >
                      Analytics
                      <ExpandMoreIcon />
                    </button>
                    <p style={{ paddingLeft: 10 }} className="my-2 ">
                      {sDate !== "ALL" && sDate + " to " + eDate}
                    </p>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 float-right">
                  <form action="">
                    <div className="input-group mb-3 border rounded-pill">
                      <div className="input-group-prepend border-0">
                        <div id="button-addon4" className="btn text-danger">
                          <i className="fas fa-search mt-2"></i>
                        </div>
                      </div>
                      <input
                        type="search"
                        id="searchBar"
                        autoComplete="off"
                        placeholder="What're you searching for?"
                        aria-describedby="button-addon4"
                        className="form-control bg-none border-0 rounded-pill searchBar"
                        onChange={(e) => {
                          if (e.target.value.length === 0) {
                            setSearch(e.target.value);
                            setActivePage(1);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            setSearch(e.target.value);
                            setActivePage(1);
                          }
                        }}
                      />
                    </div>
                  </form>
                </div>
                <div
                  id="datePicker"
                  className="collapse mt-5 pt-5"
                  aria-expanded="false"
                >
                  <div className="container table-responsive">
                    <div key={JSON.stringify(date)}>
                      <DateRangePicker
                        maxDate={maxDate}
                        onChange={(item) => {
                          setDate([item.selection]);
                          const dayStart = dayjs(
                            item.selection.startDate
                          ).format("M/DD/YYYY");
                          const dayEnd = dayjs(item.selection.endDate).format(
                            "M/DD/YYYY"
                          );
                          setActivePage(1);
                          setsDate(dayStart);
                          seteDate(dayEnd);
                          props.getFakeUser(
                            activePage,
                            rowsPerPage,
                            search,
                            sDate,
                            eDate
                          );
                        }}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        direction="horizontal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body card-overflow pt-0">
              <table class="table table-striped mt-5">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Video</th>
                    <th>Name</th>
                    <th>Gender</th>
                    {/* <th onClick={handleCoinSort} style={{ cursor: "pointer" }}>
                      RCoin {coinSort ? " ▼" : " ▲"}
                    </th> */}
                    <th>RCoin</th>
                    <th>Country</th>
                    {/* <th>Level</th> */}
                    <th>Follower</th>
                    {/* <th
                      onClick={handleFollowerSort}
                      style={{ cursor: "pointer" }}
                    >
                      Follower {followerSort ? " ▼" : " ▲"}
                    </th> */}
                    <th>Following</th>
                    {/* <th
                      onClick={handleFollowingSort}
                      style={{ cursor: "pointer" }}
                    >
                      Following {followingSort ? " ▼" : " ▲"}
                    </th> */}
                    <th>isBlock</th>
                    <th>Edit</th>

                    <th>Info</th>
                    <th>History</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              height="50px"
                              width="50px"
                              alt="app"
                              src={data.image ? data.image : Male}
                              style={{
                                boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                border: "2px solid #fff",
                                borderRadius: 10,
                                float: "left",
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                              onClick={() => handleUserInfo(data)}
                            />
                          </td>
                          <td>
                            <video
                              src={data?.link}
                              height="50px"
                              width="50px"
                              style={{
                                boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                border: "2px solid #fff",
                                borderRadius: 10,
                                float: "left",
                                objectFit: "cover",
                              }}
                              controls
                            />
                          </td>
                          <td>{data.name ? data?.name : "-"}</td>
                          <td>{data.gender}</td>
                          <td className="text-danger">{data.rCoin}</td>
                          <td className="text-success">{data.country}</td>
                          {/* <td className="text-warning">{data?.level?.name}</td> */}
                          <td>{data.followers}</td>
                          <td>{data.following}</td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={data.isBlock}
                                onChange={() =>
                                  handleBlockUnblockSwitch_(data._id)
                                }
                              />
                              <span className="slider">
                                <p
                                  style={{
                                    fontSize: 12,
                                    marginLeft: `${
                                      data.isBlock ? "-24px" : "35px"
                                    }`,
                                    color: "#000",
                                    marginTop: "6px",
                                  }}
                                >
                                  {data.isBlock ? "Yes" : "No"}
                                </p>
                              </span>
                            </label>
                          </td>
                          <td>
                            <Tooltip title="Edit">
                              <button
                                type="button"
                                style={{ backgroundColor: "#fc9494" }}
                                className="btn btn-sm text-white"
                                onClick={() => handleEdit(data)}
                              >
                                <i className="fas fa-edit fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>

                          <td>
                            <Tooltip title="Info">
                              <button
                                type="button"
                                className="btn btn-sm btn-info"
                                onClick={() => handleUserInfo(data)}
                              >
                                <i className="fas fa-info-circle fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title="History">
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={() => handleUserHistory(data)}
                              >
                                <i className="fas fa-history fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="13" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalUser}
                handleRowsPerPage={handleRowsPerPage} 
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getFakeUser, handleBlockUnblockSwitch })(
  FakeUser
);
