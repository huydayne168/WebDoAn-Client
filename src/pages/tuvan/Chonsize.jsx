
import React, { useState } from "react";

export default function Chonsize() {

    const [canNang, setCanNang] = useState(60); // kg
  const [chieuCao, setChieuCao] = useState(170); // cm

  const tuVanSize = () => {
    if (canNang < 55 && chieuCao < 165) return "S";
    if (canNang < 70 && chieuCao < 175) return "M";
    if (canNang < 85 && chieuCao < 185) return "L";
    if (canNang > 85 && chieuCao > 185) return "XL";
    return "No";
  };
  return (
    
      <div style={{width:'1280px', margin:'150px auto 0px'}}>
            <h2 style={{textAlign:'center',margin:'40px 0',fontWeight: '500'}}>Hướng dẫn chọn size chuẩn</h2>
            <div className="step">
                <span>1</span>
                <span>2</span>
                <span>3</span>
            </div>
            <div className="row">
                <div className="col p-4">
                    <p style={{textAlign:'center', fontWeight: '700',fontSize: '14px',marginBottom: '20px'}}>Loại sản phẩm</p>
                    <div className="size-left" style={{position:'sticky',top:'10px'}}>
                   <div className="choose-product" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span>-- Set đồ giáp bảo hộ gồm (áo-quần) --</span>
                    <i className="fa-solid fa-chevron-down" style={{ marginLeft: '8px' }}></i>
                    </div>

                        <div style={{width: '100%'}}>  
                            <img className="img-size" src="../Images/dobaoho.jpg" alt=""/>
                        </div>
                    </div>
                </div>
                <div className="col p-8">
                    <div className="row" style={{borderBottom:'1px solid #d9d9d9',paddingBottom:'35px'}}>
                        <div className="col p-6">
                            <p style={{textAlign:'center', fontWeight: '700',fontSize: '14px',marginBottom: '20px'}}>Thông số cơ thể</p>
                            <div className="size-center">
                                <div className="row">
                                    <div className="col p-4">
                                        <div className="thin suggest-img">
                                        </div>
                                    </div>
                                    <div className="col p-4">
                                        <div className="normal suggest-img active">
                                        </div>
                                    </div>
                                    <div className="col p-4">
                                        <div className="fat suggest-img">
                                        </div>
                                    </div>                           
                                </div>
                               <div style={{ marginTop: "20px" }}>
                                    <div
                                        style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontWeight: "700",
                                        marginBottom: "10px",
                                        }}
                                    >
                                        <span>Chiều cao</span>
                                        <span className="cm">{chieuCao}cm</span>
                                    </div>
                                    <input
                                        type="range"
                                        name="c-height"
                                        step="1"
                                        min="155"
                                        max="195"
                                        value={chieuCao}
                                        onChange={(e) => setChieuCao(parseInt(e.target.value))}
                                        id="input-cm"
                                    />

                                    <div
                                        style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontWeight: "700",
                                        marginBottom: "10px",
                                        marginTop: "20px",
                                        }}
                                    >
                                        <span>Cân nặng</span>
                                        <span className="kg">{canNang}kg</span>
                                    </div>
                                    <input
                                        type="range"
                                        name="c-weight"
                                        step="1"
                                        min="48"
                                        max="84"
                                        value={canNang}
                                        onChange={(e) => setCanNang(parseInt(e.target.value))}
                                        id="input-kg"
                                    />
                                    </div>
                            </div>
                        </div>
                        <div className="col p-6">
                            <p style={{textAlign:'center', fontWeight: '700',fontSize: '14px',marginBottom: '20px'}}>Shop gợi ý</p>

                            <div className="size-result">
                               {tuVanSize()}
                            </div>
                        </div>
                    </div>
                    <h3 style={{textAlign: 'center',fontSize: '20.5px',margin: '30px 0 30px',fontWeight: '500'}}>Size chart</h3>
                    <div style={{marginBottom:'40px'}}>
                        <img src="../Images/thongso.jpg" alt="" className="size-table"/>
                    </div>

                </div>

            </div>
        </div>
    
  );
}
