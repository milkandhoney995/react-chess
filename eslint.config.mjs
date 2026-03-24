import { fixupConfigRules } from '@eslint/compat';
import nextConfig from 'eslint-config-next';

export default fixupConfigRules(nextConfig);
