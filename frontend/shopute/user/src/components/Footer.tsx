const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 uppercase dark:text-white">
              About UTEShop
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
              UTEShop là một nền tảng trực tuyến chuyên cung cấp nhiều loại{" "}
              <span className="font-semibold">laptop và thiết bị công nghệ</span>. 
              Sứ mệnh của chúng tôi là mang đến những sản phẩm chất lượng cao với 
              mức giá hợp lý, giúp mọi người dễ dàng tiếp cận công nghệ hiện đại.
            </p>
          </div>

          {/* Members */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 uppercase dark:text-white">
              Members
            </h2>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm md:text-base">
              <li>Lê Đào Nhân Sâm</li>
              <li>Dư Hoàng Huy</li>
              <li>Nguyễn Văn Bảo</li>
              <li>Nguyễn Gia Khang</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 uppercase dark:text-white">
              Contact
            </h2>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm md:text-base">
              <li>
                <a
                  href="mailto:uteshop.st@gmail.com"
                  className="hover:underline text-blue-600 dark:text-blue-400 font-medium"
                >
                  uteshop.st@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 dark:text-gray-400 mt-10 text-center text-sm">
          &copy; {new Date().getFullYear()} UTEShop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
