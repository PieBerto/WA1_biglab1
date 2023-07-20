import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Row, Form, Col} from 'react-bootstrap'
import MyNavBar from './NavBar'
import MyFilters from './Filter';
import {default as loadLib, applyFilter} from './FilmLibrary';
import MyFilmList from './FilmList';
import {useState} from 'react';
import AddButton from './AddButton'
import AddFilmForm from './AddFilmForm'
import dayjs from 'dayjs'
import {BrowserRouter, Routes, Route, Outlet, Link,NavLink, useNavigate, useParams, useSearchParams,} from 'react-router-dom'

const filter = ['All', 'Favorites', 'Best Rated', 'Last seen', 'Unseen']

function App() {
  return (
  <BrowserRouter>
    <Routes>
        <Route index element = {<Layout mode="view"/>}/>
        <Route path="/:filter" element = {<Layout mode="view"/>}/>
        <Route path="/Add" element = {<Layout mode={'add'}/>}/>
        <Route path="/Edit" element = {<Layout mode = {'edit'}/>}/>
    </Routes>
  </BrowserRouter>

  );

  
}

function Layout(props){
  const params = useParams();
  //const [currFilter, changeFilter] = useState(params.filter);
  const [filmList,setList] = useState(loadLib().films);
  const [add,setAdd] = useState(false);
  let currFilter = params.filter? params.filter: '';
  let [searchParams, setSearchParams] = useSearchParams();
  const toggleAdd = () =>{
    setAdd(!add);
  }
  /*
  const setFilter = (filter) =>{
    setAdd(false);
    changeFilter(filter);
  }*/

  const deleteFilm = (deletedFilm) =>{
    setAdd(false);
    setList((oldFilmList) => oldFilmList.filter((film) => film.id !== deletedFilm.id))
  }


  const toggleFavorite = (targetFilm,check) => {
    setAdd(false);
    setList((oldFilmList) => oldFilmList.map((film) => { 
      if (targetFilm.id === film.id){
            targetFilm.favorite = !check
            return targetFilm
      }
      return film;
    }))
  }

  

  const updateDate = (targetFilm, event) => {
    setList((oldFilmList) => oldFilmList.map((film) => {
        if(targetFilm.id === film.id){
            if(event)
                targetFilm.date = dayjs(event);
            else targetFilm.date = undefined;
            return targetFilm;
        }
        return film;
    }));
  };

  const updateStars = (targetFilm, rating) => {
    setList((oldFilmList) => oldFilmList.map((film) => {
        if(targetFilm.id === film.id){
            targetFilm.rating = rating;
            return targetFilm;
        }
        return film;
    }));
  };

  const updateFilm = (targetFilm, updatedFilm) =>{
    setList((oldFilmList) => oldFilmList.map((film) => {
      if(targetFilm.id === film.id){
        return updatedFilm;
      }
      return film;
    }))
  }
  const addFilm = (film) =>{
    setList([...filmList,film])
  }

  let outlet;
  if (props.mode === 'view'){
     currFilter = params.filter? params.filter: 'All';
    let filteredList = applyFilter(filmList, currFilter);
    outlet = <><h1 id="title">{currFilter}</h1>
    <MyFilmList currFilter = {currFilter} deleteFilm = {deleteFilm} toggleFavorite = {toggleFavorite} filteredList = {filteredList} updateStars = {updateStars} updateDate = {updateDate} updateFilm = {updateFilm}/>
    <AddButton toggleAdd = {toggleAdd}/></>;
  }
  else if (props.mode === 'add') {
    outlet = <>
    <h1 id="title">Add a film</h1>
    <AddFilmForm film='' addFilm={addFilm} idFilm = {filmList[filmList.length-1].id + 1}/></>
  }
  else if (props.mode === 'edit') {
    
    let filmToBeEdited =  filmList.find((f) => f.id == searchParams.get('id'));
    outlet = <>
      <h1 id = "title">Edit</h1>
      <AddFilmForm film={filmToBeEdited} addFilm={addFilm} idFilm = {filmList[filmList.length-1].id + 1} mode={'Edit'} updateFilm = {updateFilm}/>
    </>
  }
  return (
    <div className ="d-flex flex-column h-100">
      <MyNavBar/>
      <Container fluid className="flex-grow-1">
          <Row className = "h-100"> 
              <MyFilters currFilter={currFilter} setFilter ={''/*setFilter*/}/>
              <Col  xs = {8} className="p-2">
                {outlet}
              </Col>
          </Row>      
      </Container>
    </div>
  );
}



/*: <AddFilmForm film='' addFilm={addFilm} idFilm = {filmList[filmList.length-1].id + 1}/>}*/





export default App;
