/**
 * Tính điểm dựa trên dự đoán và kết quả thực tế
 * @param {Object} prediction - Dự đoán của người dùng
 * @param {Object} match - Thông tin trận đấu và kết quả
 * @returns {Number} - Số điểm nhận được
 */
const calculatePoints = (prediction, match) => {
    // Nếu dự đoán đúng kết quả (thắng/thua/hòa) nhưng không đúng tỷ số
    if (prediction.predictedResult === match.result) {
      // Nếu dự đoán đúng cả tỷ số
      if (
        prediction.predictedHomeScore === match.homeScore &&
        prediction.predictedAwayScore === match.awayScore
      ) {
        return 3; // Điểm tối đa cho dự đoán đúng tỷ số
      }
      return 1; // Điểm cho dự đoán đúng kết quả
    }
    
    return 0; // Không có điểm cho dự đoán sai
  };
  
  /**
   * Xác định kết quả trận đấu dựa trên tỷ số
   * @param {Number} homeScore - Điểm đội nhà
   * @param {Number} awayScore - Điểm đội khách
   * @returns {String} - Kết quả: "home", "away", hoặc "draw"
   */
  const determineMatchResult = (homeScore, awayScore) => {
    if (homeScore > awayScore) {
      return 'home';
    } else if (homeScore < awayScore) {
      return 'away';
    } else {
      return 'draw';
    }
  };
  
  module.exports = {
    calculatePoints,
    determineMatchResult
  };