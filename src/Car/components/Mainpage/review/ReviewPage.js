import React, { useEffect, useState } from 'react';
import ReviewItem from './ReviewItem';
import Modal from './Modal';
import Modal2 from './Modal2'; // Modal2 가져오기
import styles from './ReviewPage.module.scss';

// ReviewPage 컴포넌트 정의
const ReviewPage = ({ ReviewList }) => {
  const [selectedType, setSelectedType] =
    useState('rental');
  const [selectedReview, setSelectedReview] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // 리뷰 상세보기 모달 상태
  const [isModalOpen2, setIsModalOpen2] = useState(false); // 후기 작성 모달 상태
  const [reviewList, setReviewList] = useState([]);
  const [rentalReviews, setRentalReviews] = useState([]);
  const [chargingReviews, setChargingReviews] = useState(
    [],
  );

  const reviewsPerPage = 10;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/review/list`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviewList(data);

        const rental = data
          .filter((review) => review.carName !== null)
          .reverse(); // carName이 있는 경우 렌트카 리뷰로 분류
        const charging = data
          .filter((review) => review.stationName !== null)
          .reverse(); // stationName이 있는 경우 충전소 리뷰로 분류
        setRentalReviews(rental);
        setChargingReviews(charging);
      } catch (err) {
        console.log('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleMoreClick = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleWriteReviewClick = () => {
    console.log('click event 발생!');
    setIsModalOpen2(true);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    setIsModalOpen(false);
  };

  const handleCloseModal2 = () => {
    setIsModalOpen2(false);
  };

  const handleAddReview = (review) => {
    if (selectedType === 'rental') {
      setRentalReviews([...rentalReviews, review]);
    } else {
      setChargingReviews([...chargingReviews, review]);
    }
  };

  const currentReviews =
    selectedType === 'rental'
      ? rentalReviews.slice(
          (currentPage - 1) * reviewsPerPage,
          currentPage * reviewsPerPage,
        )
      : chargingReviews.slice(
          (currentPage - 1) * reviewsPerPage,
          currentPage * reviewsPerPage,
        );

  return (
    <div className={styles.reviewPage}>
      <div className={styles.typeSwitch}>
        <button
          onClick={() => handleTypeChange('rental')}
          className={
            selectedType === 'rental' ? styles.active : ''
          }
        >
          렌트카 리뷰
        </button>
        <button
          onClick={() => handleTypeChange('charging')}
          className={
            selectedType === 'charging' ? styles.active : ''
          }
        >
          충전소 리뷰
        </button>
      </div>
      <button
        onClick={handleWriteReviewClick}
        className={styles.writeReviewButton}
      >
        후기 작성
      </button>
      <div className={styles.reviewList}>
        {currentReviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            selectedType={selectedType}
            onMoreClick={handleMoreClick}
          />
        ))}
      </div>
      <div className={styles.pagination}>
        {Array.from(
          {
            length: Math.ceil(
              (selectedType === 'rental'
                ? rentalReviews.length
                : chargingReviews.length) / reviewsPerPage,
            ),
          },
          (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={
                currentPage === index + 1
                  ? styles.active
                  : ''
              }
            >
              {index + 1}
            </button>
          ),
        )}
      </div>
      {isModalOpen && (
        <Modal
          review={selectedReview}
          selectedType={selectedType}
          onClose={handleCloseModal}
        />
      )}
      {isModalOpen2 && (
        <Modal2
          onClose={handleCloseModal2}
          selectedType={selectedType}
        />
      )}
    </div>
  );
};

export default ReviewPage;
