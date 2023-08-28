let arr = [];
let api = 'https://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx';

let btn = document.querySelector('.search');
let keyword = document.querySelector('.rounded-end');
let list = document.querySelector('.showList');
let buttonGroup = document.querySelector('.button-group');
let fruitsBtn = document.querySelector('.fruitsBtn');
let flowersBtn = document.querySelector('.flowersBtn');
let sortSelect = document.querySelector('.sort-select');

// 搜尋類型
let searchType = null;
// 搜尋關鍵字
let searchKeywords = '';
// 列表顯示資料
let viewList = [];

// 根據搜尋條件獲取資料
function search() { 
	axios.get(api)
		.then(function (response) {
			arr = response.data;
			viewList = arr.filter(function (item) {
				if (item.作物名稱) {
					return item.作物名稱.includes(searchKeywords) && (searchType ? item.種類代碼 == searchType : true);
				} else {
					return false;
				};
			});

			// 產生顯示列表
			createList();
		});
}

// 產生顯示列表
function createList() { 
	let str = '';
	viewList.forEach(item => {
		str += `<tr>
			<td>${item.作物名稱}</td>
			<td>${item.市場名稱}</td>
			<td>${item.上價}</td>
			<td>${item.中價}</td>
			<td>${item.下價}</td>
			<td>${item.平均價}</td>
			<td>${item.交易量}</td>
		</tr>`;
	});
	list.innerHTML = str;
}

// 搜尋關鍵字按鈕
btn.addEventListener('click', function (e) {
	// 取關鍵字的值
	searchKeywords = keyword.value.trim();  // 去掉空白
	
	// 呼叫搜尋
	search();
});

// 搜尋類型按鈕
buttonGroup.addEventListener('click', function (e) {
	// 尋找buttonGroup下符合class active的按鈕
	let activeBtn = buttonGroup.querySelector('.active');
	if (activeBtn) {
		activeBtn.classList.remove('active');
	}
	// 加入點擊狀態
	e.target.classList.toggle("active");
	
	// 獲取搜尋類型
	searchType = e.target.getAttribute('data-type');

	// 呼叫搜尋
	search();
	
});

// 依上價排序
sortSelect.addEventListener('change', function (e) {
	switch (e.target.value) {
		case '依上價排序':
			viewList = viewList.sort((a, b) => a.上價 - b.上價);
			break;
		case '依中價排序':
			viewList = viewList.sort((a, b) => a.中價 - b.中價);
			break;
		case '依下價排序':
			viewList = viewList.sort((a, b) => a.下價 - b.下價);
			break;
		case '依平均價排序':
			viewList = viewList.sort((a, b) => a.平均價 - b.平均價);
			break;
		case '依交易量排序':
			viewList = viewList.sort((a, b) => a.交易量 - b.交易量);
			break;
	}

	// 產生顯示列表
	createList();
});