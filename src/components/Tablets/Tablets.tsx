import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../ProductCard';
import { Loader } from '../Loader';
import { Product } from '../../types/types';
import styles from './Tablets.module.scss';

export const Tablets: React.FC = () => {
  const { t } = useTranslation();
  const [tablets, setTablets] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [perPage, setPerPage] = useState('16');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      fetch('api/products.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch');
          }

          return response.json();
        })
        .then(data => {
          const tabletProducts = data.filter(
            (product: Product) => product.category === 'tablets',
          );

          setTablets(tabletProducts);
        })
        .catch(() => {
          setError(t('catalog.no_results'));
        })
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [t]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, perPage]);

  const sortedTablets = useMemo(() => {
    const result = [...tablets];

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
  }, [tablets, sortBy]);

  const visibleTablets = useMemo(() => {
    if (perPage === 'all') {
      return sortedTablets;
    }

    const itemsPerPage = Number(perPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    return sortedTablets.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTablets, perPage, currentPage]);

  const totalPages =
    perPage === 'all' ? 0 : Math.ceil(tablets.length / Number(perPage));

  if (loading) {
    return (
      <div className={styles.tablets}>
        <div className={styles.container}>
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles['error-notification']}>
          <h2>{t('product.not_found')}</h2>
          <p>{error}</p>
          <button
            type="button"
            className={styles['retry-button']}
            onClick={() => window.location.reload()}
          >
            {t('footer.back_to_top')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tablets}>
      <div className={styles.container}>
        <nav className={styles.breadcrumbs}>
          <Link to="/" className={styles.breadcrumbs__link}>
            <img
              src="images/icons/home.svg"
              alt="home"
              className={styles.breadcrumbs__icon}
            />
          </Link>
          <img
            src="images/icons/arrow-right.png"
            alt="arrow"
            className={styles.breadcrumbs__arrow}
          />
          <span className={styles.breadcrumbs__current}>
            {t('nav.tablets')}
          </span>
        </nav>

        <h1 className={styles.tablets__title}>{t('main.category_tablets')}</h1>
        <p className={styles.tablets__count}>
          {t('catalog.models_count', { count: tablets.length })}
        </p>

        {tablets.length > 0 ? (
          <>
            <div className={styles.tablets__filters}>
              <div className={styles['tablets__filter-field']}>
                <label htmlFor="sort-by" className={styles.tablets__label}>
                  {t('catalog.sort_label')}
                </label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className={styles.tablets__select}
                >
                  <option value="newest">{t('catalog.sort_newest')}</option>
                  <option value="alphabetically">
                    {t('catalog.sort_alpha')}
                  </option>
                  <option value="cheapest">{t('catalog.sort_cheap')}</option>
                </select>
              </div>

              <div className={styles['tablets__filter-field']}>
                <label htmlFor="per-page" className={styles.tablets__label}>
                  {t('catalog.per_page_label')}
                </label>
                <select
                  id="per-page"
                  value={perPage}
                  onChange={e => setPerPage(e.target.value)}
                  className={`${styles.tablets__select} ${styles['tablets__select--short']}`}
                >
                  <option value="8">8</option>
                  <option value="16">16</option>
                  <option value="all">{t('catalog.per_page_all')}</option>
                </select>
              </div>
            </div>

            <div className={styles.tablets__grid}>
              {visibleTablets.map(tablet => (
                <ProductCard key={tablet.id} product={tablet} />
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
          <p className={styles['tablets__no-results']}>
            {t('catalog.no_results')}
          </p>
        )}
      </div>
    </div>
  );
};
