import "./styles.css";

import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Fab from "@material-ui/core/Fab";
import Fade from "@material-ui/core/Fade";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Zoom from "@material-ui/core/Zoom";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import SearchField from "react-search-field";
import InfiniteScroll from "react-infinite-scroll-component";
import ContentLoader, { Facebook } from "react-content-loader";
import CircularProgress from "@material-ui/core/CircularProgress";
import Loader from "react-loader-spinner";
import TextField from "@material-ui/core/TextField";


function TransitionsModal(props) {
  const useStylesy = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  }));
  const classes = useStylesy();
  const [open, setOpen] = React.useState(false);
  const dt = props.img;
  const dt2 = props.alt;
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center"
      }}
    >
      <img
        src={dt}
        alt={dt2}
        style={{ height: 200, width: 300 }}
        onClick={handleOpen}
      />
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <img
              src={dt}
              alt={
                <Loader
                  type="Puff"
                  color="#00BFFF"
                  height={100}
                  width={100}
                  timeout={3000} //3 secs
                />
              }
            />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

function ScrollTop(props) {
  const { children, window } = props;
  const useStylesx = makeStyles((theme) => ({
    root: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2)
    }
  }));
  const classes = useStylesx();

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func
};

function Images(props) {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper
    }
  }));
  let v = 0;
  const classes = useStyles();
  const itemData = props.img;
  useEffect(() => {});
  if (Array.isArray(itemData) === true) {
    return (
      <div className={classes.root}>
        <ImageList rowHeight={200} cols={3}>
          {itemData.map((item) => (
            <ImageListItem key={v++} cols={item.cols || 1}>
              <TransitionsModal
                img={`https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_w.jpg`}
                alt={item.title}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    );
  } else {
    return <h1> Loading... </h1>;
  }
}

export default function Main(props) {
  const [data, setData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(0);
  const [tag, setTag] = useState("");
  const [pg, setPg] = useState(1);
  const [itemData, setItemData] = useState(0);
  const [more, setMore] = useState(true);
  const [tot, setTot] = useState(0);
  const [error, setError] = useState("");
  const [text, setText] = useState("");

  const URL =
    "https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=29feae4e85ba959ffc0465f069c7b693&page=" +
    pg +
    "&format=json&nojsoncallback=1";
  const sURL =
    "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=29feae4e85ba959ffc0465f069c7b693&tags=" +
    tag +
    "&safe_search=1&page=" +
    pg +
    "&format=json&nojsoncallback=1";

  useEffect(() => {
    (async function fetchImages() {
      if (tag.length <= 1) {
        console.log("Getting Recent images data....");
        if (pg > 1) {
          await axios.get(URL).then((resp) => {
            if (resp.data === undefined || resp.data.stat === "fail") {
              console.log("ERROR is: ", resp.data);
              setData(() => null);
              setError(() => resp.data.message);
              return;
            } else {
              console.log(resp.data);
              setData((searches) => searches.concat(resp.data.photos.photo));
            }
          });
          return;
        } else {
          console.log("RECENT");
          await axios.get(URL).then((resp) => {
            setPg(() => resp.data.photos.page);
            setData(() => resp.data.photos.photo);
            setTot(() => resp.data.photos.pages);
          });
          return;
        }
      } else if (tag.length >= 2) {
        console.log("Getting Search images data....");
        if (pg > 1) {
          await axios.get(sURL).then((resp) => {
            if (resp.data === undefined || resp.data.stat === "fail") {
              console.log("ERROR is: ", resp.data);
              setData(() => null);
              setError(() => resp.data.message);
              return;
            } else {
              console.log(resp.data);
              setData((searches) => searches.concat(resp.data.photos.photo));
            }
          });
          return;
        } else {
          console.log("TAAGGG");
          await axios.get(sURL).then((resp) => {
            setPg(() => resp.data.photos.page);
            setData(() => resp.data.photos.photo);
            setTot(() => resp.data.photos.pages);
          });
          return;
        }
      }
    })();
  }, [sURL, URL, itemData, pg, tag, searchData]);

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper
    }
  }));
  const classes = useStyles();

  function nextPG() {
    if (pg >= tot) {
      setMore(() => false);
      return;
    }
    setTimeout(() => {
      setPg(() => pg + 1);
    }, 800);
  }

  function cngTXT(e) {
    setText(() => e.target.value);
  }

  if (Array.isArray(data) === true) {
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar color="black">
          <Toolbar>
            <Typography variant="h6">
              <h3>IMAGES</h3>
            </Typography>
            <div style={{ marginLeft: 300 }}></div>
            <div style={{ textAlign: "center" }}>
              {" "}
              <form>
                <div style={{ padding: 10 }}>
                  <input
                    type="text"
                    placeHolder={"Search..."}
                    value={text}
                    onChange={cngTXT}
                  />
                </div>
                <Button onClick={() => setTag(() => text)}> SEND </Button>
              </form>{" "}
            </div>
          </Toolbar>
        </AppBar>
        <Toolbar id="back-to-top-anchor" />
        <Container>
          <div className={classes.root}>
            <InfiniteScroll
              dataLength={pg}
              next={nextPG}
              hasMore={more}
              loader={
                <div
                  style={{
                    textAlign: "center",
                    padding: 30
                  }}
                >
                  <Loader
                    type="Circles"
                    color="black"
                    height={100}
                    width={100}
                    timeout={2000}
                  />
                </div>
              }
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              <Images img={data} />
            </InfiniteScroll>
          </div>
        </Container>
        <ScrollTop {...props}>
          <Fab color="black" size="medium" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </React.Fragment>
    );
  } else if (data === null) {
    return (
      <div style={{ textAlign: "center" }}>
        {" "}
        <h1> FLICKR API IS GARBAGE BC ERROR IS {error} </h1>{" "}
      </div>
    );
  } else {
    return <h1> Load... </h1>;
  }
}
