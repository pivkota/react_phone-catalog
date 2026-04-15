import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../ProductCard';
import { Loader } from '../Loader';
import { Product } from '../../types/types';
import styles from './Phones.module.scss';

export const Phones: React.FC = () => {
  const { t } = useTranslation();
  const [phones, setPhones] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [perPage, setPerPage] = useState('16');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      fetch('api/products.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch');
          }

          return response.json();
        })
        .then(data => {
          const phoneProducts = data.filter(
            (product: Product) => product.category === 'phones',
          );

          setPhones(phoneProducts);
        })
        .catch(() => {
          setError(t('catalog.error_message'));
        })
        .finally(() => {
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [t]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, perPage]);

  const sortedPhones = useMemo(() => {
    const result = [...phones];

    result.sort((a, b) => {
      switch (sortBy) {
        case 'cheapest':
          return a.price - b.price;
        case 'alphabetically':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return b.year - a.year;
      }
    });

    return result;
  }, [phones, sortBy]);

  const visiblePhones = useMemo(() => {
    if (perPage === 'all') {
      return sortedPhones;
    }

    const itemsPerPage = Number(perPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    return sortedPhones.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedPhones, perPage, currentPage]);

  const totalPages =
    perPage === 'all' ? 0 : Math.ceil(sortedPhones.length / Number(perPage));

  if (loading) {
    return (
      <div className={styles.phones}>
        <div className={styles.phones__container}>
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.phones}>
        <div className={styles.phones__container}>
          <div className={styles['error-notification']}>
            <h2 className={styles['error-notification__title']}>
              {t('catalog.error_title')}
            </h2>
            <p className={styles['error-notification__text']}>{error}</p>
            <button
              type="button"
              className={styles['error-notification__button']}
              onClick={() => window.location.reload()}
            >
              {t('catalog.retry_button')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.phones}>
      <div className={styles.phones__container}>
        <nav className={`${styles.phones__breadcrumbs} ${styles.breadcrumbs}`}>
          <Link to="/" className={styles.breadcrumbs__link}>
            <img
              src="/images/icons/home.svg"
              alt="home"
              className={styles.breadcrumbs__icon}
            />
          </Link>

          <img
            src="/images/icons/arrow-right.png"
            alt="arrow"
            className={styles.breadcrumbs__arrow}
          />

          <span className={styles.breadcrumbs__current}>
            {t('catalog.page_title')}
          </span>
        </nav>

        <h1 className={styles.phones__title}>{t('catalog.main_title')}</h1>
        <p className={styles.phones__count}>
          {t('catalog.models_count', { count: phones.length })}
        </p>

        {phones.length > 0 ? (
          <>
            <div className={styles.phones__dropdowns}>
              <div className={styles['phones__dropdown-field']}>
                <label htmlFor="sort-select" className={styles.phones__label}>
                  {t('catalog.sort_label')}
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className={styles.phones__select}
                >
                  <option value="newest">{t('catalog.sort_newest')}</option>
                  <option value="alphabetically">
                    {t('catalog.sort_alpha')}
                  </option>
                  <option value="cheapest">{t('catalog.sort_cheap')}</option>
                </select>
              </div>

              <div className={styles['phones__dropdown-field']}>
                <label
                  htmlFor="per-page-select"
                  className={styles.phones__label}
                >
                  {t('catalog.per_page_label')}
                </label>
                <select
                  id="per-page-select"
                  value={perPage}
                  onChange={e => setPerPage(e.target.value)}
                  className={`${styles.phones__select} ${styles['phones__select--short']}`}
                >
                  <option value="8">8</option>
                  <option value="16">16</option>
                  <option value="all">{t('catalog.per_page_all')}</option>
                </select>
              </div>
            </div>

            <div className={styles.phones__grid}>
              {visiblePhones.map(phone => (
                <ProductCard key={phone.id} product={phone} />
              ))}
            </div>

            {perPage !== 'all' && totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.pagination__arrow}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  {'<'}
                </button>

                <div className={styles.pagination__list}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    page => (
                      <button
                        key={page}
                        type="button"
                        className={`${styles.pagination__item} ${
                          page === currentPage
                            ? styles['pagination__item--active']
                            : ''
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  className={styles.pagination__arrow}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  {'>'}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className={styles['phones__no-results']}>
            {t('catalog.no_results')}
          </p>
        )}
      </div>
    </div>
  );
};
