import React, { useState, useEffect } from "react";

const estadoInicial = { label: "", done: false }
const urlBase = "https://playground.4geeks.com/apis/fake/todos/user/Sofia1999"

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
	const guardarTarea = async (event) => {
		if (event.key == "Enter") {

			try {
				let response = await fetch(
					urlBase,
					{
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify([...lista, tarea])
					}
				)
				if (response.ok) {
					//la tarea es actualizada correctamente, status 200-299
					cargaLista()
					setTarea(estadoInicial)
				} else {
					alert("Hubo un error al intentar actualizar la lista")
				}
			} catch (error) {
				console.log(error)

			}
		}
	}

	const deleteTask = async (id) => {
		let nuevasTareas = lista.filter((item, index) => id != index)
		try {
			let response = await fetch(
				urlBase,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(nuevasTareas)
				}
			)
			if (response.ok) {
				//la tarea es actualizada correctamente, status 200-299
				cargaLista()
			} else {
				alert("Hubo un error al intentar actualizar la lista")
			}
		} catch (error) {
			console.log(error)

		}
	}

	const handleUser = (e) => {
		setUsername(e.target.value)
	}
	const cargaLista = async () => {
		try {
			let response = await fetch(urlBase) //como obviamos el 2do parámetro, es método GET
			// response en este punto es una promesa

			if (response.ok) {
				//hago algo aquí si status está entre 200-299
				let objResponse = await response.json()
				console.log("respuesta ok: ", objResponse) //[{done:false, label:"Ir al cine"}]
				setLista(objResponse)

			}
			if (response.status == 404) {
				crearUsuario()
			}
		} catch (error) {
			console.log(error)
		}

	}
	const crearUsuario = async () => {
		try {
			let response = await fetch(urlBase, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify([])
			})
			if (response.ok) {
				cargaLista()
			}
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		//async function data(){}



		cargaLista()

	}, [])
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
