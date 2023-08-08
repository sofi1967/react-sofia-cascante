import React, { useState, useEffect } from "react";

const estadoInicial = { label: "", done: false }

//create your first component
const Home = () => {
	const [tarea, setTarea] = useState(estadoInicial)
	const [lista, setLista] = useState([])
	const [username, setUsername] = useState("")

	const handleChange = (event) => {
		setTarea({
			[event.target.name]: event.target.value
		})
	}
	const guardarTarea = (event) => {
		if (event.key == "Enter") {
			setLista([
				...lista, tarea
			])
			setTarea(estadoInicial)
		}
	}
	const handleInput = async (e) => {
		let objTexto = { label: e.target.value, done: false }
		if (e.keyCode == 13) {
			setTarea(e.target.value)
			let arregloTemp = [...lista, objTexto]

			//este primer fetch es para actualizar la lista de todos
			let response = await fetch(
				URI + username,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(arregloTemp)
				}
			)
			if (response.ok) {
				//la tarea es actualizada correctamente, status 200-299
				setLista([...lista, objTexto])
			} else {
				alert("Hubo un error al intentar actualizar la lista")
			}
		}
	}

	const deleteTask = (index) => {
		let tempArr = lista.slice() //copiar el estado lista en una variable auxiliar
		tempArr = tempArr.filter((item, index2) => { return index2 != index })
		setLista(tempArr)
	}

	const handleUser = (e) => {
		setUsername(e.target.value)
	}

	useEffect(() => {
		//async function data(){}

		const cargaLista = async () => {
			let response = await fetch(URI + username) //como obviamos el 2do parámetro, es método GET
			// response en este punto es una promesa

			if (response.ok) {
				//hago algo aquí si status está entre 200-299
				let objResponse = await response.json()
				console.log("respuesta ok: ", objResponse) //[{done:false, label:"Ir al cine"}]
				setLista(objResponse)

			} else {
				//error
				console.log("Error respuesta")
			}
		}

		cargaLista()

	}, [username])
return (
		<>
			<div className="container mt-3">
				<div className="row justify-content-center">
					<div className="col-12 col-md-6">
						<h1 className="text-center">To do list</h1>
						<input
							type="text"
							placeholder="Agrega una tarea"
							className="form-control"
							name="label" value={tarea.label} onChange={handleChange} onKeyDown={guardarTarea} />

						<ul>
							{
								lista && lista.length > 0 ?
									<>{
										lista.map((item, index) => {
											return <li key={index}>
												{item.label}
												<button type="button" onClick={e => { deleteTask(index) }}>
													❌
												</button>
											</li>
										})
									}</>
									: "la lista está vacía"}
						</ul>
					</div>
				</div>
			</div>


		</>
	);
};

export default Home;
