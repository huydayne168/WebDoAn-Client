import React from 'react'

export default function About() {
  return (
    <div id="coolmate-story">
      <section className="cs-banner">
        <div className="cs-banner__image">
          <img src="../Images/bannerpiza1.jpg" alt="Banner Ẩm Thực" />
        </div>
        <div className="cs-banner__content">
          <h1 className="cs-banner__heading">Câu chuyện về Ẩm Thực</h1>
          <p className="cs-banner__description">
            Khám phá hành trình mang hương vị gà rán, pizza, mì Ý và đồ uống mát lạnh 
            đến với thực khách, biến mỗi bữa ăn thành một trải nghiệm trọn vẹn.
          </p>
        </div>
      </section>

      <section className="cs-about">
        <div className="container-medium">
          <div className="grid">
            <div className="grid__column four-twelfths">
              <div className="cs-about__content">
                <h2 className="cs-about__heading">
                  Thực đơn của chúng tôi có gì đặc biệt ? <br />
                </h2>
              </div>
              <div className="cs-about__image">
                <img src="../Images/aboutgaran.jpg" alt="Món gà giòn rụm" />
              </div>
            </div>
            <div className="grid__column eight-twelfths">
              <div className="cs-about__description">
                <p>Gà giòn rụm, đậm vị – lựa chọn hoàn hảo cho mọi bữa tiệc gia đình và bạn bè.</p>
                <p>Pizza với lớp phô mai tan chảy và topping phong phú, mang đậm hương vị Ý.</p>
                <p>Mì Ý sốt đặc trưng – từ truyền thống đến sáng tạo, chiều lòng mọi thực khách.</p>
                <p>Đồ uống đa dạng, từ nước ngọt, trà sữa đến cocktail mát lạnh.</p>
                <p><a href="#" style={{ textDecoration: 'underline' }}>Khám phá menu chi tiết</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cs-caption">
        <div className="container-medium">
          <h2 className="cs-caption__heading">
            <span>“</span>
            Ẩm thực không chỉ là bữa ăn, mà còn là khoảnh khắc gắn kết, sẻ chia và tận hưởng hạnh phúc.
            <span>“</span>
          </h2>
          <span className="cs-caption__author">Một người yêu ẩm thực</span>
        </div>
      </section>

      <section className="cs-story">
        <div className="container-medium">
          <div className="grid grid--mobile-rev">
            <div className="grid__column five-twelfths">
              <div className="cs-story__image">
                <img src="../Images/aboutpizza.jpg" alt="Đầu bếp chuẩn bị pizza" />
                <span className="cs-services__alt">Đầu bếp chuẩn bị pizza</span>
              </div>
            </div>
            <div className="grid__column seven-twelfths">
              <div className="cs-story__content">
                <div className="cs-story__heading">
                  Dịch vụ khách hàng trong nhà hàng
                </div>
                <div className="ca-story__description">
                  <p>Chúng tôi mang đến trải nghiệm phục vụ tận tâm – từ không gian ấm cúng, 
                     món ăn chất lượng đến đội ngũ nhân viên thân thiện.</p>
                  <p>Không chỉ là thưởng thức, chúng tôi còn chia sẻ công thức, tổ chức workshop nấu ăn 
                     để khách hàng có thêm trải nghiệm thú vị.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cs-services">
        <div className="container-medium">
          <h2 className="cs-services__heading">
            Hướng tới mô hình ẩm thực bền vững và gắn kết
          </h2>

          <div id="services1" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#1. Với khách hàng</h3>
              <div className="cs-services__description">
                <p>Cam kết mang đến thực đơn đa dạng, nguyên liệu tươi ngon 
                   và dịch vụ chu đáo nhất.</p>
              </div>
            </div>
            <div className="grid__column">
              <div className="cs-services__image">
                <img src="../Images/aboutmiy.jpg" alt="Mì Ý chuẩn vị" />
                <span className="cs-services__alt">Mì Ý chuẩn vị</span>
              </div>
            </div>
          </div>

          <div id="services2" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#2. Với nhân viên</h3>
              <div className="cs-services__description">
                <p>Xây dựng môi trường làm việc thân thiện, năng động và tôn trọng sáng tạo trong ẩm thực.</p>
              </div>
            </div>
            <div className="grid__column">
              <div className="cs-services__image">
                <img src="../Images/aboutdoan3.jpg" alt="Đội ngũ nhân viên phục vụ" />
                <span className="cs-services__alt">Đội ngũ nhân viên phục vụ</span>
              </div>
            </div>
          </div>

          <div id="services3" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#3. Với đối tác</h3>
              <div className="cs-services__description">
                <p>Hợp tác cùng các nhà cung cấp nguyên liệu uy tín để đảm bảo hương vị 
                   và chất lượng món ăn tốt nhất.</p>
              </div>
            </div>
            <div className="grid__column">
              <div className="cs-services__image">
                <img src="../Images/aboutnguyenlieu.jpg" alt="Nguyên liệu tươi ngon" />
                <span className="cs-services__alt">Nguyên liệu tươi ngon</span>
              </div>
            </div>
          </div>

          <div id="services4" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#4. Với môi trường</h3>
              <div className="cs-services__description">
                <p>Ưu tiên nguyên liệu sạch, hạn chế nhựa dùng một lần 
                   và hướng tới mô hình nhà hàng xanh.</p>
              </div>
            </div>
          </div>

          <div id="services5" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#5. Với cộng đồng</h3>
              <div className="cs-services__description">
                <p>Lan tỏa niềm đam mê ẩm thực, tổ chức sự kiện ẩm thực 
                   và hỗ trợ cộng đồng thông qua các hoạt động thiện nguyện.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
