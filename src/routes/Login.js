import React,{useState,useEffect} from "react";
import styled from 'styled-components'

const Login = () => {
  const [username,setUsername] = useState("");
  const [document1,setDocument1] = useState("");
  const [document2,setDocument2] = useState("");
  const [document3,setDocument3] = useState("");
  const [document4,setDocument4] = useState("");
  const [selectedItem,setSelectedItem] = useState("1");
  const [message,setMessage] = useState("확인");

  useEffect(() =>{
    
  },[])

  const onChange = (event) =>{
    const {target : {name,value}}= event;
    if(name === "username"){
      setUsername(value);
    }else if(name ==="document1"){
      setDocument1(value);
    }else if(name ==="document2"){
      setDocument2(value);
    }else if(name ==="document3"){
      setDocument3(value);
    }else if(name ==="document4"){
      setDocument4(value);
}
  }

  const onSubmit = async (event)=>{
    event.preventDefault();
    await fetch('https://antivaccination.net/api/python',{
      method: "POST",  
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        username,
        document1,
        document2,
        document3,
        document4
      })
    })
    .then(reponse =>{
      return reponse.json();
    })
    .then((data) =>{
      if(data.result == 'Complete'){
        setMessage("인증 완료")
      }else if(data.result == 'Error'){
        setMessage("인증 실패")
      }
    })
  }

  const onSubmit2 = async (event)=>{
    event.preventDefault();
    console.log('tst')
    await fetch('http://15.165.43.226:3001/test',{
      method: "GET"
    })
      
  }


  const selectChange = (event) =>{
    const {target : {value}}= event;
    setSelectedItem(value)
    if(value === '1'){
      setSelectedItem('1')
    }else if(value === '2'){
      setSelectedItem('2')
    }
  }

  if(selectedItem == 1){
    return(
      <>
        <Background>
          <Container>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Signika+Negative:wght@300;400;600&display=swap" rel="stylesheet"/>
            <Form onSubmit={onSubmit}>
              <Label>이름 : </Label>
              <Input name="username" type="text" placeholder="Username" required value={username} onChange={onChange}></Input>
              <Label>문서 종류 : </Label>
              <Select value={selectedItem} onChange={selectChange}>
                <option selected value="1">정부24</option>
                <option value="2">질병관리청</option>
              </Select>
              <Label>문서 번호 : </Label>
              <DocumentContainer>
                <Input name="document1" type="text" value={document1} onChange={onChange}></Input>
                <Input name="document2" type="text" value={document2} onChange={onChange}></Input>
                <Input name="document3" type="text" value={document3} onChange={onChange}></Input>
                <Input name="document4" type="text" value={document4} onChange={onChange}></Input>
              </DocumentContainer>
              <Input__summit type="submit" value={message} />
            </Form>
            <Form onSubmit={onSubmit2}>
              <Input__summit type="submit" value={message} />
            </Form>
          </Container>
        </Background>
      </>
    )
  }
  else if(selectedItem == 2){
    return(
      <>
        <Background>
          <Container>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Signika+Negative:wght@300;400;600&display=swap" rel="stylesheet"/>
            <Form onSubmit={onSubmit}>
              <Label>이름 : </Label>
              <Input name="username" type="text" placeholder="Username" required value={username} onChange={onChange}></Input>
              <Label>문서 종류 : </Label>
              <Select value={selectedItem} onChange={selectChange}>
                <option selected value="1">정부24</option>
                <option value="2">질병관리청</option>
              </Select>
              <Label>문서 번호 : </Label>
              <DocumentContainer>
                <Input name="document1" type="text" value={document1} onChange={onChange}></Input>
                <Input name="document2" type="text" value={document2} onChange={onChange}></Input>
                <Input name="document3" type="text" value={document3} onChange={onChange}></Input>
              </DocumentContainer>
              <Input__summit type="submit" value={message} />
            </Form>
          </Container>
        </Background>
      </>
    )
  }
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