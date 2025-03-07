import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, connect } from "react-redux";
import { Link,useHistory } from "react-router-dom";
import { getComplain } from "../../store/complain/action";
import { OPEN_COMPLAIN_DIALOG } from "../../store/complain/types";
import ComplainDetails from "../dialog/ComplainDetails";
import { TablePagination, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { baseURL } from "../../util/config";
import noImage from "../../assets/images/noImage.png";
import {$} from "jquery"
const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const PendingComplainTable = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getComplain("solved"))
  }, [dispatch]);

  const complain = useSelector((state) => state.complain.complain);

  useEffect(() => {
    setData(complain);
  }, [complain]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();
    if (value) {
      const data = complain.filter((data) => {
        return (
          data?.userId?.name?.toUpperCase()?.indexOf(value) > -1 ||
          data?.contact?.toUpperCase()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(complain);
    }
  };

  const handleViewComplainDetail = (data) => {
    dispatch({ type: OPEN_COMPLAIN_DIALOG, payload: data });
  };
  const handleUserInfo = (user) => {

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.removeItem("userFollow");
    history.push("/admin/user/detail");
    // history.push({ pathname: "/admin/user/detail", state: user?._id });
  };
  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Solved Complain</h3>
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
                  Complain
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Solved Complain
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="card">
            <div className="card-header pb-0">
              <div className="row my-3">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left"></div>
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
                        placeholder="What're you searching for?"
                        aria-describedby="button-addon4"
                        className="form-control bg-none border-0 rounded-pill searchBar"
                        onChange={handleSearch}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="card-body card-overflow">
              <div class="d-sm-flex align-items-center justify-content-between mb-4"></div>

              <table class="table table-striped">
                <thead className="text-center">
                  <tr>
                    <th>No.</th>
                    <th>User</th>
                    <th>Complain Image</th>
                    <th>Contact</th>
                    <th>Solved date</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data.length > 0 ? (
                    (rowsPerPage > 0
                      ? data.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : data
                    ).map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{data.userId?.name}</td>
                          <td>
                            <img
                              height="50px"
                              width="50px"
                              alt="app"
                              src={data.image ? baseURL + data.image : noImage}
                              style={{
                                boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                border: "2px solid #fff",
                                borderRadius: 10,
                                objectFit: "cover",
                                display: "block",
                              }}
                              className="mx-auto"
                              onClick={() => handleUserInfo(data)}
                            />
                          </td>

                          <td>{data.contact}</td>
                          <td>
                            {dayjs(data.updatedAt).format("DD MMM, YYYY")}
                          </td>

                          <td>
                            <Tooltip title="Complain Details">
                              <button
                                type="button"
                                className="btn btn-sm btn-info"
                                onClick={() => handleViewComplainDetail(data)}
                              >
                                <i className="fas fa-info-circle fa-lg"></i>
                              </button>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <TablePagination
                id="pagination"
                component="div"
                rowsPerPageOptions={[
                  5,
                  10,
                  25,
                  100,
                  { label: "All", value: -1 },
                ]}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </div>
          </div>
        </div>
      </div>
      <ComplainDetails />
    </>
  );
};

export default connect(null, { getComplain })(PendingComplainTable);
