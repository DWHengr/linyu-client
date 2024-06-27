export function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

export function getDateDayAndMonth(date) {
    const initDate = new Date(date);
    const day = initDate.getDate();
    const month = initDate.getMonth() + 1;
    return `${month}月${day}日`;
}

export function getYearDayMonth(date) {
    const initDate = new Date(date);
    const year = initDate.getFullYear();
    const day = initDate.getDate();
    const month = initDate.getMonth() + 1;
    return `${year}-${month}-${day}`;
}

export function formatTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    if (diffMs < oneDay) {
        // 当天消息
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours < 12 ? '上午' : '下午';
        const formattedHours = hours % 12 || 12; // 把24小时制转换为12小时制
        return `${period} ${formattedHours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else if (diffMs < oneWeek) {
        // 超过1天，小于1周
        const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const day = daysOfWeek[date.getDay()];
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${day} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else {
        // 大于1周
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 月份从0开始
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }
}

export function formatDateString(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2); // Add leading zero and take last two characters
    const day = (`0${date.getDate()}`).slice(-2); // Add leading zero and take last two characters
    return `${year}-${month}-${day}`;
}