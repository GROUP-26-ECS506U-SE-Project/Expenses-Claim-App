import { Link } from 'react-router-dom';

function AboutPage ()  {
    return ( 
        <body class="about-body">

            <nav className="navbar">
              <Link className='navbuttons' to="/" >Home</Link>
              <Link className='navbuttons' to="/about" >About</Link>
                <div class="dropdown">
                    <button class="dropbtn">Claims
                     <i class="fa fa-caret-down"></i>
                    </button>
                    <div class="dropdown-content">
                        <Link className='navbuttons' to="/viewClaim" >View Claims</Link>
                        <Link className='navbuttons' to="/addClaim">Add New Claim</Link>
                    </div>
              </div>
              <Link className='loginsignupbutton' to="/LoginSignup">Login and Sign-Up</Link>
            </nav>
            <div class="divider"></div>


            <div class="main-body-container">
            <div class="divider"></div>
            <h1 class="about-title">About</h1>
            <p class="about-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>



        </body>
        

        
     );
}
 
export default AboutPage;