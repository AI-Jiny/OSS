import React,{useState,useEffect, useRef} from "react";
import styled from 'styled-components'

const Login = () => {
  const [username,setUsername] = useState("");
  const [auth,setAuth] = useState("gov");
  const [vaccination1,setVaccination1] = useState("");
  const [vaccination2,setVaccination2] = useState("");
  const [vaccination3,setVaccination3] = useState("");
  const [vaccination4,setVaccination4] = useState("");
  const [selectedItem,setSelectedItem] = useState(true);
  const [flag,setFlag] = useState(true);
  const [message,setMessage] = useState("");
  const time = 30;
  const [timer,setTimer] = useState(30);
  let timerRef = useRef();
  const decreaseNum = () => setTimer((prev) => prev - 1);

  useEffect(() =>{
  },[])

  const onChange = (event) =>{
    const {target : {name,value}}= event;
    if(name === "username"){
      setUsername(value);
    }else if(name ==="vaccination1"){
      setVaccination1(value);
    }else if(name ==="vaccination2"){
      setVaccination2(value);
    }else if(name ==="vaccination3"){
      setVaccination3(value);
    }else if(name ==="vaccination4"){
      setVaccination4(value);
    }
}

  const flashFunction = () =>{
    if(flag == true && message == ""){
    }else{
      if(flag == true){
        return( <Message>{message}</Message> )
      }else{
        return( <Message>{`${timer} 초 남았습니다`}</Message> )
      }
    } 
  }

  const onSubmit = async (event)=>{
    event.preventDefault();
    setFlag(false)
    clearInterval(timerRef.current);
    setTimer(20);
    timerRef.current = setInterval(decreaseNum, 1000);
    await fetch('http://localhost:3000/api/python',{
      method: "POST",  
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        username,
        auth,
        vaccination1,
        vaccination2,
        vaccination3,
        vaccination4,
        time
      })
    })
    .then(reponse =>{
      return reponse.json();
    })
    .then((data) =>{
      if(data.result == 'Complete'){
        setMessage("인증에 성공하였습니다.")
        setFlag(true)
      }else if(data.result == 'Error'){
        setMessage("예방접종 문서에서 코로나를 인식할 수 없습니다.")
        setFlag(true)
      }else if(data.result == 'BlankError'){
        setMessage("문서 번호란을 양식에 맞춰 정확히 채워주세요.")
        setFlag(true)
      }else if(data.result == 'TimeOutError'){
        setMessage("에러 : 관리자에게 문의해주세요.")
        setFlag(true)
      }else if(data.result == 'NameError'){
        setMessage("이름을 입력해주세요.")
        setFlag(true)
      }else if(data.result == 'NotFoundDocument'){
        setMessage("문서 번호를 찾을 수 없습니다.")
        setFlag(true)
      }
    })
  }


  const selectChange = (event) =>{
    const {target : {value}}= event;
    setVaccination1("")
    setVaccination2("")
    setVaccination3("")
    setVaccination4("")
    if(value === "true"){
      setSelectedItem(true)
      setAuth('gov')
    }else if(value === "false"){
      setSelectedItem(false)
      setAuth('kdca')
    }
  }


    return(
      <>
        <Background>
          <Container>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Signika+Negative:wght@300;400;600&display=swap" rel="stylesheet"/>
            <Form onSubmit={onSubmit}>
              <Label>이름 : </Label>
              <Input name="username" type="text" placeholder="Username" value={username} onChange={onChange}></Input>
              <Label>문서 종류 : </Label>
              <Select value={selectedItem} onChange={selectChange}>
                <option selected value="true">정부24</option>
                <option value="false">질병관리청</option>
              </Select>
              <Label>문서 번호 : </Label>
              <DocumentContainer>
                <Input name="vaccination1" type="text" value={vaccination1} onChange={onChange}></Input>
                <Input name="vaccination2" type="text" value={vaccination2} onChange={onChange}></Input>
                <Input name="vaccination3" type="text" value={vaccination3} onChange={onChange}></Input>
                { selectedItem ? <Input name="vaccination4" type="text" value={vaccination4} onChange={onChange}></Input> : <></> }
                
              </DocumentContainer>
              <Input__summit disabled={!flag} type="submit" value={'인증하기'} />
              {flashFunction()}
            </Form>
          </Container>
        </Background>
      </>
    )
}

export default Login;

const Background = styled.div`
position:absolute;
width:100%;
height:100%;
background: white;
`

const Container = styled.div`
display:flex;
flex-direction: column;
background-color: black;
position:absolute;
width: 500px;
margin-left: -250px;
margin-top: 200px;
left:50%;
padding:80px;
opacity:95%;
font-family: 'Signika Negative', sans-serif;
`

const Label = styled.label`
color: white;
`

const Form = styled.form`
`
const Input = styled.input`
width: 100%;
align-items: center;
margin-bottom: 30px;
border-right:0px;
border-top:0px;
border-left:0px;
border-color: white;
background-color: transparent;
color:white;
margin-right: 10px;
::placeholder {
  color: white;
}
`

const Input__summit = styled.input`
width: 100%;
height: 35px;
align-items: center;
border-radius: 5px;
color:white;
background: linear-gradient(to right, #0872ff, #2985ff);

`

const Select = styled.select`
width: 100%;
height: 30px;
margin-bottom: 30px;
background: linear-gradient(to right, #0872ff, #2985ff);
color:black;
`

const DocumentContainer = styled.div`
display:flex;
`

const Message = styled.div`
color: white;
`