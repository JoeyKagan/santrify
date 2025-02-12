"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function Page({ params }) {

  //state
  const id = params.id;
  const [kamar, setKamar] = useState({});
  const [gambar, setGambar] = useState("");
  const [nama_kamar, setNamaKamar] = useState(kamar.nama_kamar);
  const [status, setStatus] = useState(kamar.status);
  const navigate = useRouter();

  //state validation
  const [validation, setValidation] = useState({});

  const getKamarById = async (id) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/kamar/${id}`
      );
      setNamaKamar(data.data.nama_kamar);
      setStatus(data.data.status);
    } catch (error) {
      console.log(error.message);
    }
  };

  //function "handleFileChange"
  const handleFileChange = (e) => {
    //define variable for get value image data
    const imageData = e.target.files[0];
    //check validation file
    if (!imageData.type.match("image.*")) {
      //set state "image" to null
      setGambar("");
      return;
    }
    //assign file to state "image"
    setGambar(imageData);
  };

  //method "updatePost"
  const updatePost = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //append data to "formData"
    formData.append("nama_kamar", nama_kamar);
    formData.append("status", status);
    formData.append("gambar", gambar);
    formData.append("_method", "PUT");
    //send data to server
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/kamar/${id}`, formData)
      .then(() => {
        navigate.push("/dashboard/room");
      });
  };

  useEffect(() => {
    getKamarById(id);
  }, []);

  return (
    // <Layout>
    <div className="container" style={{ marginTop: "80px" }}>
      <div className="row">
        <div className="col-md-12">
          <div className="card border-0 rounded shadow-sm">
            <div className="card-body">
              <form onSubmit={updatePost}>
                <div className="form-group mb-3">
                  <label className="form-label fw-bold">Nama Kamar</label>
                  <input
                    className="form-control"
                    type="text"
                    value={nama_kamar}
                    onChange={(e) => setNamaKamar(e.target.value)}
                    placeholder="Masukkan Nama"
                  />
                </div>
                {validation.nama_kamar && (
                  <div className="alert alert-danger">{validation.nama_kamar}</div>
                )}

                <div className="form-group mb-3">
                  <label className="form-label fw-bold">Status Kamar</label>
                  <select
                    className="form-select"
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Status"
                    defaultValue={"Pilih"}
                  >
                    <option value={"Kosong"}>Kosong</option>
                    <option value={"Tersedia"}>Tersedia</option>
                    <option value={"Penuh"}>Penuh</option>
                    <option value={"Pilih"}>Pilih</option>
                  </select>
                </div>
                {validation.status && (
                  <div className="alert alert-danger">{validation.status}</div>
                )}

                <div className="form-group mb-3">
                  <label className="form-label fw-bold">Gambar</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
                <button
                  tabIndex="-1"
                  type="submit"
                  className="mx-1 px-4 py-2 text-sm text-white bg-success rounded"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
