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

    // 检查是否是昨天
    const isYesterday = now.getDate() - date.getDate() === 1 && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear();

    if (diffMs < oneDay && !isYesterday) {
        // 当天消息
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else if (isYesterday) {
        // 昨天的消息
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `昨天 ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
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

export function formatTimingTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}