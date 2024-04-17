import { useEffect, useState } from 'react'
import { Header } from '../../components/Header'
import background from '../../assets/githubimage.png'
import { ItemList } from '../../components/ItemList'
import './styles.css'


function App() {
  const [user, setUser] = useState(localStorage.getItem('githubUser'))
  const [currentUser, setCurrentUser] = useState(null)
  const [repos, setRepos] = useState(null)


  useEffect(() => {

    const storedUser = localStorage.getItem('githubUser');
    
    if (storedUser) {
      
      setUser(storedUser)
      handleGetData();
    }
        
  }, []);

  const handleInputChange = (event) => {

    const value = event.target.value;
    setUser(value);
    localStorage.setItem('githubUser', value)

  }



  const handleGetData = async () => {

    const userData = await fetch(`https://api.github.com/users/${user}`);
    const newUser = await userData.json();

    if (newUser.name) {

      const { avatar_url, name, bio, login } = newUser;
      setCurrentUser({ avatar_url, name, bio, login })
    }
    else {
      setCurrentUser(null)
    }

    const reposData = await fetch(`https://api.github.com/users/${user}/repos`);
    const newRepos = await reposData.json();

    if (newRepos.length) {

      setRepos(newRepos);
    }
    else {
      setRepos(null);
    }
  }


  return (
    <div className="App">

      <Header />
      <div className='conteudo'>
        <img src={background} className='background' alt='background app'></img>
        <div className='info'>
          <div className='divisorMobile'>
            <input name='usuario' value={user} onChange={handleInputChange} placeholder='@username'></input>
            <button onClick={handleGetData}>Buscas</button>
          </div>
          {currentUser?.name ? (<>
            <div className='perfil'>
              <img src={currentUser.avatar_url} className='profile' alt='profile'></img>
              <div>
                <h3>{ currentUser.name}</h3>
                <span>{currentUser.login}</span>
                <p>{currentUser.bio}</p>

              </div>
            </div>
            <hr></hr>
          </>
          ) : null}

          {repos?.length ? (<>
            
            
            <div>
              <h4 className='repositorio'>
                Repositório
              </h4>
              {repos.map(repo => (
                
                <ItemList title={repo.name} link={repo.html_url} description= {repo.description}></ItemList>
              ))}
              
            </div>
            </>
          ) : null}
          </div>
        </div>
      </div>
      );
}

      export default App;
